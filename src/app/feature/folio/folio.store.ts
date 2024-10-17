import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '../../core/models/interfaces';
import { assetInit, assetViewInit, folioInit, folioViewInit, placementInit } from '../../core/models/initValues';
import { FolioService } from './folio.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, firstValueFrom, map, pipe, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const FolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools('folios'),
  withState({
    folioIdSelected: 0,
    folios: [folioInit],
    placements: [placementInit],
    assets: [assetInit],
    isLoading: false,
    isAddingFolio: false,
    isAddingPlacement: false,
  }),

  withStorageSync({
    key: 'folios',
    autoSync: false,
  }),

  withComputed(store => {
    return {
      assetViewsComputed: computed<AssetView[]>(() =>
        store.assets().map(asset => ({
          ...asset,
          url: '',
          paddingBottom: '',
        }))
      ),
    };
  }),

  withComputed(store => {
    return {
      placementViewsComputed: computed<PlacementView[]>(() =>
        store.placements().map(placement => ({
          ...placement,
          asset: store.assetViewsComputed().find(a => a.id === placement.assetId) ?? assetViewInit,
        }))
      ),
    };
  }),

  withComputed(store => {
    return {
      folioViewsComputed: computed<FolioView[]>(() =>
        store.folios().map(folio => {
          const placementViews = store.placementViewsComputed().filter(placement => placement.folioId === folio.id);
          return {
            ...folio,
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

  withMethods(store => {
    return {
      async folioStateToLocalStorage() {
        updateState(store, '[Author] WriteToLocalStorage Start', { isLoading: true });
        store.writeToStorage();
        updateState(store, '[Author] WriteToLocalStorage Success', { isLoading: false });
      },
    };
  }),

  withMethods(store => {
    const dbFolio = inject(FolioService);
    return {
      // #region Folio
      foliosLoadAll: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            updateState(store, '[Folio] Load All Start', { isLoading: true });
            return dbFolio.foliosGetAll().pipe(
              map((allFolios: Folio[]) => {
                updateState(store, '[Folio] Load All Success', value => ({
                  ...value,
                  folios: allFolios,
                  isLoading: false,
                }));
                return allFolios;
              }),
              catchError(error => {
                updateState(store, '[Folio] getAllFolios Failure', {
                  isLoading: false,
                  // error: error.message || 'An error occurred while loading folios',
                });
                return throwError(error);
              })
            );
          })
        )
      ),

      toggleFolioAdder(state: boolean) {
        updateState(store, `[Folio] Is Adding  ${state}`, { isAddingFolio: state });
      },

      setFolioSelected(folioId: number) {
        updateState(store, `[Folio] Select By Id  ${folioId}`, { folioIdSelected: folioId });
      },

      folioCreateForNewAuthor(folio: Folio) {
        updateState(store, '[Folio] Create Start', { isLoading: true });
        dbFolio
          .folioCreate(folio)
          .pipe(
            map((newFolio: Folio) => {
              updateState(store, '[Folio] Create Success', {
                folios: [...store.folios(), newFolio],
                isLoading: false,
              });
              store.writeToStorage();
              return newFolio;
            }),
            catchError(error => {
              updateState(store, '[Folio] Create Failed', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
      },

      async folioCreateWithParent(folioData: Partial<Folio>): Promise<{ newFolio: Folio; newAsset: Asset; newPlacement: Placement }> {
        updateState(store, '[Folio] Create Start', { isLoading: true });
        const { newFolio, newAsset, newPlacement } = await firstValueFrom(
          dbFolio.folioCreateWithParent(folioData).pipe(
            catchError(error => {
              console.error('FolioStore creation failed', error);
              updateState(store, '[Folio] Create Failed', { isLoading: false });
              return throwError(error);
            })
          )
        );
        updateState(store, '[Folio] Create Success', {
          folios: [...store.folios(), newFolio],
          isLoading: false,
        });
        updateState(store, '[Folio Placement] Create Success', {
          placements: [...store.placements(), newPlacement],
        });
        updateState(store, '[Folio Asset] Create Success', {
          assets: [...store.assets(), newAsset],
        });
        store.writeToStorage();

        return { newFolio, newAsset, newPlacement };
      },

      //#endregion Folio

      //#region Placement

      placementsLoadAll: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            updateState(store, '[Placement] Placements Load Start', { isLoading: true });
            return dbFolio.placementsGetAll().pipe(
              map((allPlacements: Placement[]) => {
                updateState(store, '[Placement] Placements Load Success', value => ({
                  ...value,
                  placements: allPlacements,
                  isLoading: false,
                }));
                return allPlacements;
              }),
              catchError(error => {
                updateState(store, '[Placement] getAllPlacements Failure', {
                  isLoading: false,
                  //  error: error.message || 'An error occurred while loading placements',
                });
                return throwError(error);
              })
            );
          })
        )
      ),

      placementCreate(placement: Placement) {
        updateState(store, '[Placement] Create Start', { isLoading: true });
        dbFolio
          .placementCreate(placement)
          .pipe(
            map((newPlacement: Placement) => {
              updateState(store, '[Placement] Create Success', {
                placements: [...store.placements(), newPlacement],
                isLoading: false,
              });
              store.writeToStorage();
              return newPlacement;
            }),
            catchError(error => {
              updateState(store, '[Placement] Create Failed', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
      },

      togglePlacementAdder(state: boolean) {
        updateState(store, `[Placement] Is Adding = ${state}`, { isAddingPlacement: state });
      },

      //#endregion

      //#region Asset
      Assets: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Asset] getAllAssets Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbFolio.assetsGetAll().pipe(
              //  takeUntilDestroyed(),
              tap({
                next: (allAssets: Asset[]) => {
                  updateState(store, '[Asset] getAllAssets Success', value => ({
                    ...value,
                    assets: allAssets,
                    isLoading: false,
                  }));
                },
              })
            );
          })
        )
      ),

      assetCreate(asset: Asset) {
        updateState(store, '[Asset] Create Start', { isLoading: true });
        dbFolio
          .assetCreate(asset)
          .pipe(
            map((newAsset: Asset) => {
              updateState(store, '[Asset] Create Success', {
                assets: [...store.assets(), newAsset],
                isLoading: false,
              });
              store.writeToStorage();
              return newAsset;
            }),
            catchError(error => {
              updateState(store, '[Asset] Create Failed', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
      },

      assetCreateWithPlacement(assetData: Asset, caption: string) {
        updateState(store, '[Asset-Media] Create Start', { isLoading: true });
        dbFolio
          .assetCreateWithPlacement(assetData, store.folioViewSelected().id, caption)
          .pipe(
            map(({ newAsset, newPlacement }) => {
              updateState(store, '[Asset-Media] Placement Create Success', {
                placements: [...store.placements(), newPlacement],
              });
              updateState(store, '[Asset-Media] Asset Create Success', {
                assets: [...store.assets(), newAsset],
              });
              store.writeToStorage();
            }),
            catchError(error => {
              console.error('FolioStore creation failed', error);
              updateState(store, '[Asset-Media] Create Failed', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
      },

      //#endregion
    };
  }),

  withHooks({
    // onInit(store) {
    //   // store.loadAllFolios();
    //   // store.loadAllPlacements();
    //   // store.Assets();
    // },
  })
);
