import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { pipe, switchMap, of, exhaustMap, catchError, throwError, map, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Author, AuthorView, PitchView, FolioView, TreeNode } from '../../core/models/interfaces';
import { authorInit, authorViewInit } from '../../core/models/initValues';
import { AuthorService } from './author.service';

import { environment } from '../../../environments/environment';
import { FolioStore } from '../folio/folio.store';
import { PitchStore } from '../pitch/pitch.store';

export const AuthorStore = signalStore(
  { providedIn: 'root' },
  withDevtools('authors'),
  withState({
    authorLoggedIn: authorInit,
    authorSelectedId: '',
    authors: [authorInit],
    isLoading: false,
    consentStatus: 'unknown' as string,
  }),

  withStorageSync({
    key: 'authors',
    autoSync: false,
  }),

  withComputed(store => {
    const folioStore = inject(FolioStore);
    const pitchStore = inject(PitchStore);
    // const authors = store.authors().filter(a => a.id.length > 0);
    // const folios = folioStore.folioViewsComputed();
    // const pitches = pitchStore.pitchViewsComputed();
    return {
      authorSelectedFolioViews: computed<FolioView[]>(() =>
        folioStore.folioViewsComputed().filter(folio => folio.authorId === store.authorSelectedId())
      ),

      authorSelectedPitchViews: computed<PitchView[]>(() =>
        pitchStore.pitchViewsComputed().filter(folio => folio.authorId === store.authorSelectedId())
      ),

      authorViews: computed<AuthorView[]>(() => {
        return store
          .authors()
          .filter(a => a.id.length > 0)
          .map(author => {
            const authorView: AuthorView = {
              id: author.id,
              name: author.name,
              authorFolio: folioStore
                .folioViewsComputed()
                .filter(folio => folio.authorId === author.id && folio.parentFolioId === undefined)[0],
              pitches: pitchStore.pitchViewsComputed().filter(pitch => pitch.authorId === author.id),
            };
            return authorView;
          });
      }),
    };
  }),

  withComputed(store => ({
    authorSelectedView: computed<AuthorView>(
      () => store.authorViews().find(author => author.id === store.authorSelectedId()) ?? authorViewInit
    ),
    authorLoggedInView: computed<AuthorView>(
      () => store.authorViews().find(author => author.id === store.authorLoggedIn().id) ?? authorViewInit
    ),
    authorFolioViewList: computed<FolioView[]>(() => {
      const folios = store.authorSelectedFolioViews;
      const retval: FolioView[] = [];

      const traverseFolios = (folio: FolioView, depth: number, path: number[] = []) => {
        if (path.includes(folio.id)) {
          // Avoid cycles
          return;
        }
        const newPath = [...path, folio.id];

        folio.level = depth;
        retval.push(folio);
        folio.placementViews.forEach(placement => {
          if (placement.assetView.mediaType === 'folio') {
            const childFolio = folios().find(folio => folio.id === Number(placement.assetView.sourceId));
            if (childFolio) {
              traverseFolios(childFolio, depth + 1, newPath);
            }
          }
        });
      };
      folios()
        .filter(folio => !folio.parentFolioId)
        .forEach(folio => {
          traverseFolios(folio, 0);
        });

      return retval;
    }),
    authorFolioTree: computed<TreeNode[]>(() => {
      const folios = store.authorSelectedFolioViews;
      return folios()
        .filter(folio => !folio.parentFolioId) // Start with root folios (no parent)
        .map(folio => buildTreeNode(folio, 0, folios()));
    }),
  })),

  withMethods(store => {
    const dbAuthor = inject(AuthorService);

    return {
      async getConsentValueFromLocalStorage(consentValue: string) {
        updateState(store, '[Author] Read From Storage Start', { isLoading: true });
        store.readFromStorage();
        if (environment.ianConfig.showLogs) console.log(' store.authorLoggedIn()', store.authorLoggedIn());
        updateState(store, '[Author] Read From Storage Success', { isLoading: false, consentStatus: consentValue });
      },

      async authorCreate(author: Author) {
        updateState(store, '[Author] Add Start', { isLoading: true });
        return dbAuthor
          .authorCreate(author)
          .pipe(
            exhaustMap(newAuthor =>
              of(newAuthor).pipe(
                tap(() => {
                  updateState(store, '[Author] Add Success', {
                    authors: [...store.authors(), newAuthor],
                    isLoading: false,
                  });
                })
              )
            ),
            catchError(error => {
              console.error('[Author] Add Failure', error);
              updateState(store, '[Author] Add Failure', { isLoading: false });
              return throwError(() => error);
            })
          )
          .subscribe();
      },

      async authorLogin(author: Author) {
        updateState(store, '[Author] Add Success', {
          authorLoggedIn: author,
          authorSelectedId: author.id,
          isLoading: false,
        });
        store.writeToStorage();
      },

      async authorLoggedInUpdate(authorId: string, authorData: Author) {
        updateState(store, '[Author-LoggedIn] Update Start', { isLoading: true });

        if (environment.ianConfig.showLogs) console.log('updatedAuthor ', authorData);
        dbAuthor
          .authorUpdate(authorId, authorData)
          .pipe(
            exhaustMap(updatedAuthor => {
              if (environment.ianConfig.showLogs) console.log('updatedAuthor ', updatedAuthor);
              updateState(store, '[Author-LoggedIn] Update Success', {
                authorLoggedIn: updatedAuthor,
                authors: store.authors().map(author => (author.id === updatedAuthor.id ? updatedAuthor : author)),
                isLoading: false,
              });
              store.writeToStorage();
              return of(updatedAuthor);
            }),
            catchError(error => {
              if (environment.ianConfig.showLogs) console.log('error', error);
              updateState(store, '[Author] Update Failure', { isLoading: false });
              return throwError(() => error);
            })
          )
          .subscribe();
      },

      authorSelectedSetById: rxMethod<string>(
        pipe(
          switchMap(authorId => {
            updateState(store, '[Author] GetById Start', { isLoading: true });
            const knownAuthor = store.authors().find(author => author.id === authorId);
            if (knownAuthor) {
              updateState(store, '[Author] GetById Success', {
                authorSelectedId: authorId,
                isLoading: false,
              });
              return of(knownAuthor);
            } else {
              return dbAuthor.authorGetById(authorId).pipe(
                map((author: Author) => {
                  updateState(store, '[Author] GetById Success', {
                    authors: [...store.authors(), author],
                    authorSelectedId: authorId,
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
    };
  })
);
function buildTreeNode(folioView: FolioView, depth: number, allFolios: FolioView[], path: number[] = []): TreeNode {
  if (path.includes(folioView.id)) {
    return {
      name: `f ${'-'.repeat(depth)} ${folioView.folioName} (cycle detected)`,
      children: [],
      isSelected: false,
    };
  }

  const newPath = [...path, folioView.id];
  const levelIndicator = '-'.repeat(depth);
  const node: TreeNode = {
    name: `${levelIndicator} ${folioView.folioName}`,
    children: [],
    isSelected: false,
  };

  folioView.placementViews.forEach(placement => {
    if (placement.assetView.mediaType === 'folio') {
      // const referencedFolio = this.getFolioById(Number(placement.asset.sourceId), allFolios);
      const referencedFolio = allFolios.find(folio => folio.id === Number(placement.assetView.sourceId));
      if (referencedFolio) {
        node.children?.push(buildTreeNode(referencedFolio, depth + 1, allFolios, newPath));
      }
    } else {
      // Include non-folio placements with level indicators
      node.children?.push({
        name: `${placement.caption}`,
        children: [],
        isSelected: false,
      });
    }
  });

  return node;
}
