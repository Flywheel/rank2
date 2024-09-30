import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { pipe, tap, switchMap, of } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Author, AuthorView } from '../../shared/interfaces/interfaces';
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
    cookieStatus: 'unknown' as string,
  }),

  //   withStorageSync<Author>({
  //     key: 'synced', // key used when writing to/reading from storage
  //     autoSync: false, // read from storage on init and write on state changes - `true` by default
  //     select: (state: Author) => Partial<Author>, // projection to keep specific slices in sync
  //     parse: (stateString: string) => State, // custom parsing from storage - `JSON.parse` by default
  //     stringify: (state: Author) => string, // custom stringification - `JSON.stringify` by default
  //     storage: () => sessionstorage, // factory to select storage to sync with
  //   }),

  withMethods(store => {
    const dbAuthor = inject(AuthorService);
    return {
      setCurrentAuthorView: rxMethod<string>(
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
