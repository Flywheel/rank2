import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '@core/models/interfaces';
import { assetInit, assetViewInit, folioInit, folioViewInit, placementInit } from '@core/models/initValues';
import { FolioService } from './folio.service';
import { computed, inject } from '@angular/core';
import { exhaustMap, firstValueFrom, pipe, tap } from 'rxjs';
import { ErrorService } from '@core/services/error.service';
import { ActionKeyService } from '@core/services/action-key.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

const featureKey = 'Folio';
export const FolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools(featureKey),
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
    key: featureKey,
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
    const actionKeys = actionKeyService.getActionEvents(featureKey);

    return {
      async createRootFolio(folioPrep: Folio): Promise<void> {
        const actionKey = actionKeys('Create Root Folio');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          const newFolio = await firstValueFrom(dbFolio.createFolioAsRoot(folioPrep));
          updateState(store, actionKey.success, {
            folios: [...store.folios(), newFolio],
            isLoading: false,
          });
          store.writeToStorage();
        } catch (error) {
          updateState(store, actionKey.failed, { isLoading: false });
          handleError(error, actionKey.failed);
        }
      },

      createRootFolioRX: rxMethod<Folio>(
        pipe(
          exhaustMap(folioPrep => {
            const actionKey = actionKeys('Create Root Folio');
            updateState(store, actionKey.event, { isLoading: true });
            return dbFolio.createFolioAsRoot(folioPrep).pipe(
              tap({
                next: newFolio => {
                  updateState(store, actionKey.success, {
                    folios: [...store.folios(), newFolio],
                    isLoading: false,
                  });
                  store.writeToStorage();
                },
                error: error => {
                  updateState(store, actionKey.failed, { isLoading: false });
                  handleError(error, actionKey.failed);
                },
              })
            );
          })
        )
      ),

      createPlacement: rxMethod<Placement>(
        pipe(
          exhaustMap(placement => {
            const actionKey = actionKeys('Create Placement');
            updateState(store, actionKey.event, { isLoading: true });
            return dbFolio.placementCreate(placement).pipe(
              tap({
                next: newPlacement => {
                  updateState(store, actionKey.success, {
                    placements: [...store.placements(), newPlacement],
                    isLoading: false,
                  });
                  store.writeToStorage();
                },
                error: error => {
                  updateState(store, actionKey.failed, { isLoading: false });
                  handleError(error, actionKey.failed);
                },
              })
            );
          })
        )
      ),

      assetCreate: rxMethod<Asset>(
        pipe(
          exhaustMap(assetPrep => {
            const actionKey = actionKeys('Create Asset');
            updateState(store, actionKey.event, { isLoading: true });
            return dbFolio.assetCreate(assetPrep).pipe(
              tap({
                next: newAsset => {
                  updateState(store, actionKey.success, {
                    assets: [...store.assets(), newAsset],
                    isLoading: false,
                  });
                  store.writeToStorage();
                },
                error: error => {
                  updateState(store, actionKey.failed, { isLoading: false });
                  handleError(error, actionKey.failed);
                },
              })
            );
          })
        )
      ),

      async createBranchFolio(folioPrep: Partial<Folio>): Promise<{ newFolio: Folio; newAsset: Asset; newPlacement: Placement }> {
        const actionKey = actionKeys('Create Branch Folio');
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
        const actionKey = actionKeys('Create Placement with Asset');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          const { newAsset, newPlacement } = await firstValueFrom(dbFolio.createPlacementAsAsset(assetPrep, folioId, caption));

          updateState(store, actionKey.success, {
            placements: [...store.placements(), newPlacement],
            assets: [...store.assets(), newAsset],
          });
          store.writeToStorage();
        } catch (error) {
          updateState(store, actionKey.failed, { isLoading: false });
          handleError(error, actionKey.failed);
        }
      },

      createPlacementWithAssetRX: rxMethod<{ folioId: number; caption: string; assetPrep: Asset }>(
        pipe(
          exhaustMap(({ assetPrep, folioId, caption }) => {
            const actionKey = actionKeys('Create Placement with Asset');
            updateState(store, actionKey.event, { isLoading: true });
            return dbFolio.createPlacementAsAsset(assetPrep, folioId, caption).pipe(
              tap({
                next: ({ newAsset, newPlacement }) => {
                  updateState(store, actionKey.success, {
                    placements: [...store.placements(), newPlacement],
                    assets: [...store.assets(), newAsset],
                    isLoading: false,
                  });
                  store.writeToStorage();
                },
                error: error => {
                  updateState(store, actionKey.failed, { isLoading: false });
                  handleError(error, actionKey.failed);
                },
              })
            );
          })
        )
      ),

      togglePlacementAdder(state: boolean) {
        updateState(store, `[Placement] Is Adding = ${state}`, { isAddingPlacement: state });
      },

      toggleFolioAdder(state: boolean) {
        updateState(store, actionKeys(`Folio Is Adding ${state}`).event, { isAddingFolio: state });
      },

      setFolioSelected(folioId: number) {
        updateState(store, actionKeys(`Folio Select By Id: ${folioId}`).event, { folioIdSelected: folioId });
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

// async createPlacement2(placement: Placement) {
//   updateState(store, '[Placement] Create Start', { isLoading: true });
//   try {
//     const newPlacement = await firstValueFrom(dbFolio.placementCreate(placement));
//     updateState(store, '[Placement] Create Success', {
//       placements: [...store.placements(), newPlacement],
//       isLoading: false,
//     });
//     store.writeToStorage();
//   } catch (error) {
//     handleError(error, 'Placement Create Failed');
//     updateState(store, '[Placement] Create Failed', { isLoading: false });
//     throw error;
//   }
// },
// async assetCreate1(assetPrep: Asset) {
//   updateState(store, '[Asset] Create Start', { isLoading: true });
//   try {
//     const newAsset = await firstValueFrom(dbFolio.assetCreate(assetPrep));
//     updateState(store, '[Asset] Create Success', {
//       assets: [...store.assets(), newAsset],
//       isLoading: false,
//     });
//     store.writeToStorage();
//   } catch (error) {
//     handleError(error, 'Placement Create Failed');
//     updateState(store, '[Placement] Create Failed', { isLoading: false });
//     throw error;
//   }
// },
