import { inject } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { pipe, tap, switchMap, of, exhaustMap, catchError, throwError } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Author, AuthorView } from '../../core/interfaces/interfaces';
import { authorInit, authorViewInit } from '../../core/interfaces/initValues';
import { AuthorService } from './author.service';

import { environment } from '../../../environments/environment';

export const AuthorStore = signalStore(
  { providedIn: 'root' },
  withDevtools('authors'),
  withState({
    loggedInAuthor: authorInit,
    allAuthors: [authorInit],
    currentAuthorView: authorViewInit,
    knownAuthors: [authorViewInit],
    isLoading: false,
    isStartupLoadingComplete: false,
    consentStatus: 'unknown' as string,
  }),

  withStorageSync({
    key: 'authors',
    autoSync: false,
  }),

  withMethods(store => {
    const dbAuthor = inject(AuthorService);

    return {
      async setConsentState(consentValue: string) {
        updateState(store, '[Author] setConsentState Pending', { isLoading: true });
        store.readFromStorage();
        updateState(store, '[Author] setConsenttate Success', { isLoading: false, consentStatus: consentValue });
      },

      loadAllAuthors: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Author] getAllAuthors Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbAuthor.authorsGetAll().pipe(
              tap({
                next: (allAuthors: Author[]) => {
                  updateState(store, '[Author] getAllAuthors Success', value => ({
                    ...value,
                    allAuthors: allAuthors,
                    knownAuthors: allAuthors as AuthorView[],
                    isLoading: false,
                  }));
                },
              })
            );
          })
        )
      ),

      addAuthor3x: rxMethod<Author>(
        pipe(
          tap(() => {
            updateState(store, '[Author] addAuthor Start', { isLoading: true });
          }),
          exhaustMap(author => {
            return dbAuthor.authorCreate(author).pipe(
              tap({
                next: (newAuthor: Author) => {
                  updateState(store, '[Author] addAuthor Success', value => ({
                    ...value,
                    allAuthors: [...value.allAuthors, newAuthor],
                    isLoading: false,
                  }));
                },
                error: error => {
                  updateState(store, '[Author] addAuthor Failure', { isLoading: false });
                  return throwError(error);
                },
              })
            );
          })
        )
      ),

      addAuthor3(author: Author) {
        // updateState(store, '[Folio] addAuthor Pending', { isLoading: true });
        dbAuthor
          .authorCreate(author)
          .pipe(
            tap({
              next: (newAuthor: Author) => {
                updateState(store, '[Author] createAuthor Success', {
                  loggedInAuthor: newAuthor,
                  allAuthors: [...store.allAuthors(), newAuthor],
                  isLoading: false,
                });
              },
              error: error => {
                if (environment.ianConfig.showLogs) console.log('error', error);
                updateState(store, '[Folio] addFolio Failed', { isLoading: false });
              },
            })
          )
          .subscribe();
      },

      authorCreate: rxMethod<Author>(
        pipe(
          tap(x => {
            if (environment.ianConfig.showLogs) console.log(x);
            updateState(store, '[Author] createAuthor Start', { isLoading: true });
          }),
          exhaustMap(author => {
            return dbAuthor.authorCreate(author).pipe(
              tap({
                next: (newAuthor: Author) => {
                  updateState(store, '[Author] createAuthor Success', {
                    loggedInAuthor: newAuthor,
                    allAuthors: [...store.allAuthors(), newAuthor],
                    isLoading: false,
                  });
                  if (environment.ianConfig.showLogs) console.log(` addNewAuthorId: ${newAuthor.id}`);
                  store.writeToStorage();
                },
                error: () => {
                  updateState(store, '[Author] createAuthor Error', { isLoading: false });
                },
              })
            );
          })
        )
      ),

      authorUpdate: rxMethod<Partial<Author>>(
        pipe(
          tap(() => {
            updateState(store, '[Author] updateAuthor Start', { isLoading: true });
          }),
          exhaustMap(authorData => {
            const authorId = store.loggedInAuthor().id;
            return dbAuthor.authorUpdate(authorId, authorData).pipe(
              tap({
                next: (updatedAuthor: Author) => {
                  updateState(store, '[Author] updateAuthor Success', {
                    loggedInAuthor: updatedAuthor,
                    isLoading: false,
                  });
                  store.writeToStorage();
                },
              }),
              catchError(error => {
                updateState(store, `[Author] updateAuthor Failure ${error.message}`, {
                  isLoading: false,
                });
                return throwError(() => new Error('Failed to update author'));
              })
            );
          })
        )
      ),

      authorById: rxMethod<string>(
        pipe(
          tap(() => {
            updateState(store, '[Author] getAuthorById Start', { isLoading: true });
          }),
          switchMap(authorId => {
            const existingAuthor = store.knownAuthors().find(author => author.id === authorId);
            if (existingAuthor) {
              return of(existingAuthor);
            } else {
              return dbAuthor.authorGetById(authorId).pipe(
                tap({
                  next: (author: Author) => {
                    updateState(store, '[Author] getAuthorById Success', {
                      knownAuthors: [...store.knownAuthors(), author as AuthorView],
                    });
                  },
                })
              );
            }
          }),
          tap(author =>
            updateState(store, '[Author] getAuthorById Success', {
              loggedInAuthor: author,
              isLoading: false,
            })
          )
        )
      ),

      authorViewByUid: rxMethod<string>(
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
