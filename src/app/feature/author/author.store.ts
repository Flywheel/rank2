import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { pipe, tap, switchMap, of } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Author, AuthorView } from '../../core/interfaces/interfaces';
import { AuthorService } from './author.service';
const emptyAuthor: Author = {
  id: '',
  name: '',
  authenticatorId: '',
  eventLog: [],
};

export const AuthorStore = signalStore(
  { providedIn: 'root' },
  withDevtools('authors'),
  withState({
    loggedInAuthor: emptyAuthor,
    currentAuthorView: emptyAuthor,
    knownAuthors: [emptyAuthor] as AuthorView[],
    isLoading: false,
    isStartupLoadingComplete: false,
    consentStatus: 'unknown' as string,
  }),

  // withStorageSync({
  //   key: 'authors',
  // }),

  withMethods(store => {
    const dbAuthor = inject(AuthorService);

    return {
      async setConsentState(consentValue: string) {
        updateState(store, '[Author] setCookieState Pending', { isLoading: true });

        updateState(store, '[Author] setCookieState Success', { isLoading: false, consentStatus: consentValue });
      },

      authorCreate: rxMethod<string>(
        pipe(
          tap(() => {
            updateState(store, '[Author] createAuthor Start', { isLoading: true });
          }),
          switchMap(authenticatorId => {
            return dbAuthor.authorCreate(authenticatorId).pipe(
              tap({
                next: (newAuthor: Author) => {
                  updateState(store, '[Author] createAuthor Success', {
                    loggedInAuthor: newAuthor,
                    isLoading: false,
                  });
                },
              })
            );
          })
        )
      ),

      authorViewSetByUid: rxMethod<string>(
        pipe(
          tap(() => {
            updateState(store, '[Author] getAuthorViewById Start', { isLoading: true });
          }),
          switchMap(authorId => {
            const existingAuthorView = store.knownAuthors().find(view => view.id === authorId);
            if (existingAuthorView) {
              return of(existingAuthorView);
            } else {
              const theAuthorView = dbAuthor.authorViewGetById(authorId).pipe(
                tap({
                  next: (authorView: AuthorView) => {
                    updateState(store, '[Author] Load AuthorViewById Success', {
                      knownAuthors: [...store.knownAuthors(), authorView],
                    });
                  },
                })
              );
              return theAuthorView;
            }
          }),
          tap(folioView =>
            updateState(store, '[Author] getAuthorViewById Success', {
              currentAuthorView: folioView,
              //  folioSlate: store.allAuthorSlates().filter(a => a.authorId === folioView.id)[0] ?? slateViewInit,
              isLoading: false,
            })
          )
        )
      ),
    };
  })
);
