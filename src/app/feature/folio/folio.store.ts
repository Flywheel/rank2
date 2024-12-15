import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '../../core/models/interfaces';
import { assetInit, assetViewInit, folioInit, folioViewInit, placementInit } from '../../core/models/initValues';
import { FolioService } from './folio.service';
import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from '../../core/services/error.service';
import { ActionKeyService } from '../../core/services/action-key.service';

const groupSource = 'Folio';

export const FolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools(groupSource),
  withState({
    folios: [folioInit],
    folioIdSelected: 0,
    isAddingFolio: false,
    isLoading: false,
    isAddingPlacement: false,
    placements: [placementInit],
    assets: [assetInit],
  }),

  withStorageSync({
    key: groupSource,
    autoSync: false,
  }),

  //#region Computed Signals

  withComputed(store => {
    return {
      assetViewsComputed: computed<AssetView[]>(() =>
        store
          .assets()
          .filter(a => a.id > 0)
          .map(asset => ({
            ...asset,
          }))
      ),
    };
  }),

  withComputed(store => {
    return {
      placementViewsComputed: computed<PlacementView[]>(() =>
        store
          .placements()
          .filter(a => a.id > 0)
          .map(placement => ({
            ...placement,
            assetView: store.assetViewsComputed().find(a => a.id === placement.assetId) ?? assetViewInit,
          }))
      ),
    };
  }),

  withComputed(store => {
    return {
      folioViewsComputed: computed<FolioView[]>(() =>
        store
          .folios()
          .filter(a => a.id > 0)
          .map(folio => {
            const placementViews = store.placementViewsComputed().filter(placement => placement.folioId === folio.id);
            return {
              ...folio,
              level: 0,
              placementViews,
            };
          })
      ),
    };
  }),

  withComputed(store => {
    return {
      folioViewSelected: computed<FolioView>(() => {
        return store.folioViewsComputed().find(folio => folio.id === store.folioIdSelected()) ?? folioViewInit;
      }),
    };
  }),

  //#endregion

  //#region Methods
  withMethods(store => {
    const dbFolio = inject(FolioService);
    const errorService = inject(ErrorService);
    const handleError = errorService.handleSignalStoreResponse;
    const actionKeyService = inject(ActionKeyService);
    const actionKeys = actionKeyService.getActionEvents(groupSource);

    return {
      toggleFolioAdder(state: boolean) {
        updateState(store, actionKeys(`Folio Is Adding ${state}`).event, { isAddingFolio: state });
      },

      setFolioSelected(folioId: number) {
        updateState(store, actionKeys(`Folio Select By Id: ${folioId}`).event, { folioIdSelected: folioId });
      },

      async createFolioAsRoot(folioPrep: Folio): Promise<void> {
        const actionKey = actionKeys('Create Folio as Root');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          const newFolio = await firstValueFrom(dbFolio.createFolioAsRoot(folioPrep));
          updateState(store, actionKey.success, {
            folios: [...store.folios(), newFolio],
            isLoading: false,
          });
        } catch (error) {
          updateState(store, actionKey.failed, { isLoading: false });
          throw handleError(error, actionKey.failed);
        } finally {
          store.writeToStorage();
        }
      },

      async createFolioAsBranchingAsset(folioPrep: Partial<Folio>): Promise<{ newFolio: Folio; newAsset: Asset; newPlacement: Placement }> {
        const actionKey = actionKeys('Create Folio as Branch');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          const { newFolio, newAsset, newPlacement } = await firstValueFrom(dbFolio.createFolioAsAsset(folioPrep));
          updateState(store, actionKey.success, {
            folios: [...store.folios(), newFolio],
            isLoading: false,
          });
          updateState(store, '[Placement] Create Success', {
            placements: [...store.placements(), newPlacement],
          });
          updateState(store, '[Asset] Create Success', {
            assets: [...store.assets(), newAsset],
          });
          store.writeToStorage();

          return { newFolio, newAsset, newPlacement };
        } catch (error) {
          updateState(store, actionKey.failed, { isLoading: false });
          throw handleError(error, actionKey.failed);
        }
      },

      async createPlacementWithAsset(folioId: number, caption: string, assetPrep: Asset) {
        updateState(store, '[Asset-Media] Create Start', { isLoading: true });
        try {
          const { newAsset, newPlacement } = await firstValueFrom(dbFolio.createPlacementAsAsset(assetPrep, folioId, caption));

          updateState(store, '[Asset-Media] Placement Create Success', {
            placements: [...store.placements(), newPlacement],
          });
          updateState(store, '[Asset-Media] Asset Create Success', {
            assets: [...store.assets(), newAsset],
          });
          store.writeToStorage();
        } catch (error) {
          handleError(error, 'Placement with Asset Create Failed');
          updateState(store, '[Placement With Asset] Create Failed', { isLoading: false });
          throw error;
        }
      },

      togglePlacementAdder(state: boolean) {
        updateState(store, `[Placement] Is Adding = ${state}`, { isAddingPlacement: state });
      },

      async createPlacement(placement: Placement) {
        updateState(store, '[Placement] Create Start', { isLoading: true });
        try {
          const newPlacement = await firstValueFrom(dbFolio.placementCreate(placement));
          updateState(store, '[Placement] Create Success', {
            placements: [...store.placements(), newPlacement],
            isLoading: false,
          });
          store.writeToStorage();
        } catch (error) {
          handleError(error, 'Placement Create Failed');
          updateState(store, '[Placement] Create Failed', { isLoading: false });
          throw error;
        }
      },

      async assetCreate(assetPrep: Asset) {
        updateState(store, '[Asset] Create Start', { isLoading: true });
        try {
          const newAsset = await firstValueFrom(dbFolio.assetCreate(assetPrep));
          updateState(store, '[Asset] Create Success', {
            assets: [...store.assets(), newAsset],
            isLoading: false,
          });
          store.writeToStorage();
        } catch (error) {
          handleError(error, 'Placement Create Failed');
          updateState(store, '[Placement] Create Failed', { isLoading: false });
          throw error;
        }
      },
    };
  })
  //#endregion

  // withStorageSync({
  //   key: 'folios',
  //   autoSync: false,
  // }),
);

// async createFolioAsAsset2(folioPrep: Partial<Folio>): Promise<{ newFolio: Folio; newAsset: Asset; newPlacement: Placement }> {
//   updateState(store, '[Folio-Branch] Create Start', { isLoading: true });

//   const { newFolio, newAsset, newPlacement } = await firstValueFrom(
//     dbFolio.createFolioAsAsset(folioPrep).pipe(
//       catchError(error => {
//         updateState(store, '[Folio-Branch] Create Failed', { isLoading: false });
//         return throwError(error);
//       })
//     )
//   );
//   updateState(store, '[Folio-Branch] Create Success', {
//     folios: [...store.folios(), newFolio],
//     isLoading: false,
//   });
//   updateState(store, '[Placement] Create Success', {
//     placements: [...store.placements(), newPlacement],
//   });
//   updateState(store, '[Asset] Create Success', {
//     assets: [...store.assets(), newAsset],
//   });
//   store.writeToStorage();

//   return { newFolio, newAsset, newPlacement };
// },

// async createPlacementWithAsset2(folioId: number, caption: string, assetPrep: Asset) {
//   updateState(store, '[Asset-Media] Create Start', { isLoading: true });
//   dbFolio
//     .createPlacementAsAsset(assetPrep, folioId, caption)
//     .pipe(
//       map(({ newAsset, newPlacement }) => {
//         updateState(store, '[Asset-Media] Placement Create Success', {
//           placements: [...store.placements(), newPlacement],
//         });
//         updateState(store, '[Asset-Media] Asset Create Success', {
//           assets: [...store.assets(), newAsset],
//         });
//         store.writeToStorage();
//       }),
//       catchError(error => {
//         console.error('FolioStore creation failed', error);
//         updateState(store, '[Asset-Media] Create Failed', { isLoading: false });
//         return error;
//       })
//     )
//     .subscribe();
// },

// async createPlacement2(placement: Placement) {
//   updateState(store, '[Placement] Create Start', { isLoading: true });
//   dbFolio
//     .placementCreate(placement)
//     .pipe(
//       map((newPlacement: Placement) => {
//         updateState(store, '[Placement] Create Success', {
//           placements: [...store.placements(), newPlacement],
//           isLoading: false,
//         });
//         store.writeToStorage();
//         return newPlacement;
//       }),
//       catchError(error => {
//         updateState(store, '[Placement] Create Failed', { isLoading: false });
//         return error;
//       })
//     )
//     .subscribe();
// },

// assetCreate2(assetPrep: Asset) {
//   updateState(store, '[Asset] Create Start', { isLoading: true });
//   dbFolio
//     .assetCreate(assetPrep)
//     .pipe(
//       map((newAsset: Asset) => {
//         updateState(store, '[Asset] Create Success', {
//           assets: [...store.assets(), newAsset],
//           isLoading: false,
//         });
//         store.writeToStorage();
//         return newAsset;
//       }),
//       catchError(error => {
//         updateState(store, '[Asset] Create Failed', { isLoading: false });
//         return error;
//       })
//     )
//     .subscribe();
// },
