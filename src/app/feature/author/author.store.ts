import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Author, AuthorView, PitchView, FolioView, TreeNode } from '@shared/models/interfaces';
import { authorInit, authorViewInit } from '@shared/models/initValues';
import { AuthorService } from '@feature/author/author.service';

import { FolioStore } from '@feature/folio/folio.store';
import { PitchStore } from '@feature/pitch/pitch.store';
import { ErrorService } from '@shared/services/error.service';
import { ActionKeyService } from '@shared/services/action-key.service';
import { environment } from 'src/environments/environment';
import { AUTHOR_DEFAULT_NAME } from '@shared/models/constants';

const featureKey = 'Author';

export const AuthorStore = signalStore(
  { providedIn: 'root' },
  withDevtools(featureKey),
  withState({
    authors: [authorInit],
    authorLoggedIn: { id: '0', name: AUTHOR_DEFAULT_NAME },
    authorSelectedId: '',
    isLoading: false,
    consentStatus: 'unknown' as string,
    startupCompleted: false,
  }),

  withStorageSync({
    key: featureKey,
    autoSync: false,
  }),

  withComputed(store => {
    const folioStore = inject(FolioStore);
    const pitchStore = inject(PitchStore);

    return {
      needsAuthorName: computed<boolean>(
        () => store.authorLoggedIn().name === AUTHOR_DEFAULT_NAME && store.consentStatus() === 'accepted' && store.startupCompleted()
      ),

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

    authorSelectedFolioViewsWithDepth: computed<FolioView[]>(() => {
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
    const errorService = inject(ErrorService);
    const handleError = errorService.handleSignalStoreResponse;
    const actionKeyService = inject(ActionKeyService);
    const actionKeys = actionKeyService.getActionEvents(featureKey);

    return {
      async getConsentValueFromLocalStorage(consentValue: string) {
        const actionKey = actionKeys('Read From Storage');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          store.readFromStorage();
          updateState(store, actionKey.success, { isLoading: false, consentStatus: consentValue });
        } catch (error) {
          handleError(error, actionKey.failed);
          updateState(store, actionKey.failed, { isLoading: false });
          throw error;
        }
      },

      async createAuthor(authorPrep: Author, inscribeToStorage: boolean) {
        const actionKey = actionKeys('Create Author');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          const newAuthor = await firstValueFrom(dbAuthor.authorCreate(authorPrep));
          updateState(store, actionKey.success, {
            authors: [...store.authors(), newAuthor],
            isLoading: false,
          });
        } catch (error) {
          handleError(error, actionKey.failed);
          updateState(store, actionKey.failed, { isLoading: false });
          throw error;
        } finally {
          if (inscribeToStorage) store.writeToStorage();
        }
      },

      async loginAuthor(author: Author) {
        const actionKey = actionKeys('Login');
        try {
          updateState(store, actionKey.event, {
            authorLoggedIn: author,
            authorSelectedId: author.id,
            isLoading: true,
          });
          store.writeToStorage();
          updateState(store, actionKey.success, { isLoading: false });
        } catch (error) {
          handleError(error, actionKey.failed);
          updateState(store, actionKey.failed, { isLoading: false });
          throw error;
        }
      },

      async updateLoggedInAuthor(authorId: string, authorPrep: Author): Promise<void> {
        if (environment.ianConfig.showLogs) {
          console.log('Updating author', authorPrep, authorId);
        }
        const actionKey = actionKeys('Set Author Name');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          const updatedAuthor = await firstValueFrom(dbAuthor.authorUpdate(authorId, authorPrep));
          updateState(store, actionKey.success, {
            authorLoggedIn: updatedAuthor,
            authors: store.authors().map(author => (author.id === updatedAuthor.id ? updatedAuthor : author)),
            isLoading: false,
          });
          store.writeToStorage();
        } catch (error) {
          console.log(error);
          handleError(error, actionKey.failed);
          updateState(store, actionKey.failed, { isLoading: false });
          throw error;
        }
      },

      async authorSelectedSetById(authorId: string): Promise<Author> {
        const actionKey = actionKeys(`Set Selected Author By Id`);
        updateState(store, actionKey.event, { isLoading: true });
        const knownAuthor = store.authors().find(author => author.id === authorId);
        if (knownAuthor) {
          updateState(store, `${actionKey.success} From Cache`, {
            authorSelectedId: authorId,
            isLoading: false,
          });
          return knownAuthor;
        } else {
          try {
            const author = await firstValueFrom(dbAuthor.authorGetById(authorId));
            updateState(store, `${actionKey.success} From Backend `, {
              authors: [...store.authors(), author],
              authorSelectedId: authorId,
              isLoading: false,
            });
            return author;
          } catch (error) {
            handleError(error, actionKey.failed);
            updateState(store, actionKey.failed, { isLoading: false });
            throw error;
          }
        }
      },

      async authorGetFromDbByd(authorId: string): Promise<Author> {
        try {
          const author = await firstValueFrom(dbAuthor.authorGetById(authorId));

          return author;
        } catch (error) {
          handleError(error, 'getbyId failed');
          throw error;
        }
      },

      setStartupCompleted() {
        updateState(store, `[${featureKey}] Startup Completed`, {
          startupCompleted: true,
        });
      },
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
