import { inject } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { pipe, switchMap, of, exhaustMap, catchError, throwError, map } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Author, AuthorView } from '../../core/interfaces/interfaces';
import { authorInit } from '../../core/interfaces/initValues';
import { AuthorService } from './author.service';

import { environment } from '../../../environments/environment';

export const AuthorStore = signalStore(
  { providedIn: 'root' },
  withDevtools('authors'),
  withState({
    authorLoggedIn: authorInit,
    authorIdSelected: '',
    authors: [authorInit],
    //authorViewsKnown: [authorViewInit],
    isLoading: false,
    consentStatus: 'unknown' as string,
  }),

  withStorageSync({
    key: 'authors',
    autoSync: false,
  }),

  withMethods(store => {
    return {
      async authorStateToLocalStorage(authorIdSelected: string) {
        updateState(store, '[Author] WriteToLocalStorage Start', { isLoading: true, authorIdSelected });
        store.writeToStorage();
        updateState(store, '[Author] WriteToLocalStorage Success', { isLoading: false });
      },
    };
  }),

  withMethods(store => {
    const dbAuthor = inject(AuthorService);

    return {
      async setConsent(consentValue: string) {
        updateState(store, '[Author] Read From Storage Start', { isLoading: true });
        store.readFromStorage();
        if (environment.ianConfig.showLogs) console.log(' store.authorLoggedIn()', store.authorLoggedIn());
        updateState(store, '[Author] Read From Storage Success', { isLoading: false, consentStatus: consentValue });
      },

      async authorAddIdWithDefaultName(author: Author) {
        updateState(store, '[Author] Add Start', { isLoading: true });
        dbAuthor
          .authorCreate(author)
          .pipe(
            exhaustMap(newAuthor => {
              updateState(store, '[Author] Add Success', {
                authorLoggedIn: newAuthor,
                authorIdSelected: newAuthor.id,
                authors: [...store.authors(), newAuthor],
                //   authorViewsKnown: [...store.authorViewsKnown(), newAuthor as AuthorView],
                isLoading: false,
              });
              store.authorStateToLocalStorage(newAuthor.id);
              return of(newAuthor);
            }),
            catchError(error => {
              if (environment.ianConfig.showLogs) console.log('error', error);
              updateState(store, '[Author] Add Failure', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
      },

      async authorLoggedInUpdate(authorId: string, updateData: Partial<Author>) {
        updateState(store, '[Author-LoggedIn] Update Start', { isLoading: true });
        const authorData: Partial<Author> = {
          name: updateData.name,
        };
        if (environment.ianConfig.showLogs) console.log('updatedAuthor ', authorData);
        dbAuthor
          .authorUpdate(authorId, authorData)
          .pipe(
            exhaustMap(updatedAuthor => {
              if (environment.ianConfig.showLogs) console.log('updatedAuthor ', updatedAuthor);
              updateState(store, '[Author-LoggedIn] Update Success', {
                authorLoggedIn: updatedAuthor,
                authors: [...store.authors(), updatedAuthor],
                // authorViewsKnown: [...store.authorViewsKnown(), updatedAuthor as AuthorView],
                isLoading: false,
              });
              store.writeToStorage();
              return of(updatedAuthor);
            }),
            catchError(error => {
              if (environment.ianConfig.showLogs) console.log('error', error);
              updateState(store, '[Author] Update Failure', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
      },

      // async authorUpdatex(authorId: string, updateData: Partial<Author>) {
      //   const authorData: Partial<Author> = {
      //     name: updateData.name,
      //   };
      //   return dbAuthor.authorUpdate(authorId, authorData).pipe(
      //     tap({
      //       next: (updatedAuthor: Author) => {
      //         updateState(store, '[Author] updateAuthor Success', {
      //           authorLoggedIn: updatedAuthor,
      //           isLoading: false,
      //         });
      //         store.writeToStorage();
      //       },
      //       error: error => {
      //         updateState(store, `[Author] updateAuthor Failure ${error.message}`, {
      //           isLoading: false,
      //         });
      //         return throwError(() => new Error('Failed to update author'));
      //       },
      //     })
      //   );
      // },

      authorsLoad: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            updateState(store, '[Author] Load Start', { isLoading: true });
            return dbAuthor.authorsGetAll().pipe(
              map((allAuthors: Author[]) => {
                updateState(store, '[Author] authorsLoad Success', value => ({
                  ...value,
                  authors: allAuthors,
                  authorViewsKnown: allAuthors as AuthorView[],
                  isLoading: false,
                }));
                return allAuthors;
              }),
              catchError(error => {
                updateState(store, '[Author] Load Failure', {
                  isLoading: false,
                  // error: error.message || 'An error occurred while loading folios',
                });
                return throwError(error);
              })
            );
          })
        )
      ),

      authorById: rxMethod<string>(
        pipe(
          switchMap(authorId => {
            updateState(store, '[Author] GetById Start', { isLoading: true });
            const existingAuthor = store.authors().find(author => author.id === authorId);
            if (existingAuthor) {
              updateState(store, '[Author] GetById Success', {
                authors: [...store.authors(), existingAuthor],
                isLoading: false,
              });
              return of(existingAuthor);
            } else {
              return dbAuthor.authorGetById(authorId).pipe(
                map((author: Author) => {
                  updateState(store, '[Author] GetById Success', {
                    authors: [...store.authors(), author],
                    isLoading: false,
                  });
                  return author;
                }),
                catchError(error => {
                  // Handle error state
                  updateState(store, `[Author] GetById Failure ${error.message}`, {
                    isLoading: false,
                  });
                  // Propagate the error
                  return throwError(() => new Error('Failed to get author'));
                })
              );
            }
          })
        )
      ),

      // authorViewByUid: rxMethod<string>(
      //   pipe(
      //     tap(() => {
      //       updateState(store, '[Author] getAuthorViewById Start', { isLoading: true });
      //     }),
      //     switchMap(authorId => {
      //       const existingAuthorView = store.authorViewsKnown().find(view => view.id === authorId);
      //       if (existingAuthorView) {
      //         return of(existingAuthorView);
      //       } else {
      //         const theAuthorView = dbAuthor.authorViewGetById(authorId).pipe(
      //           tap({
      //             next: (authorView: AuthorView) => {
      //               updateState(store, '[Author] Load AuthorViewById Success', {
      //                 authorViewsKnown: [...store.authorViewsKnown(), authorView],
      //               });
      //             },
      //           })
      //         );
      //         return theAuthorView;
      //       }
      //     }),
      //     tap(folioView =>
      //       updateState(store, '[Author] getAuthorViewById Success', {
      //         authorViewSelected: folioView,
      //         //  folioSlate: store.allAuthorSlates().filter(a => a.authorId === folioView.id)[0] ?? slateViewInit,
      //         isLoading: false,
      //       })
      //     )
      //   )
      // ),
    };
  })
);
