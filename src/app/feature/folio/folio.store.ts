import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '../../core/models/interfaces';
import { assetInit, assetViewInit, folioInit, folioViewInit, placementInit, placementViewInit } from '../../core/models/initValues';
import { FolioService } from './folio.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, pipe, tap, throwError } from 'rxjs';

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
    placementViews: [placementViewInit],
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
            updateState(store, '[Folio] getAllFolios Start', { isLoading: true });
            return dbFolio.foliosGetAll().pipe(
              map((allFolios: Folio[]) => {
                updateState(store, '[Folio] getAllFolios Success', value => ({
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
        updateState(store, '[Folio] setFolioSelected', { folioIdSelected: folioId });
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

      folioCreateWithParent(folioData: Partial<Folio>) {
        updateState(store, '[Folio] Create Start', { isLoading: true });
        dbFolio
          .folioCreateWithParent(folioData)
          .pipe(
            map(({ newFolio, newAsset, newPlacement }) => {
              updateState(store, '[Folio] Create Success', {
                folios: [...store.folios(), newFolio],
                isLoading: false,
                folioIdSelected: newFolio.id,
              });
              updateState(store, '[Placement] Create Success', {
                placements: [...store.placements(), newPlacement],
              });
              updateState(store, '[Asset] Create Success', {
                assets: [...store.assets(), newAsset],
              });

              // Update Placements

              store.writeToStorage();
              return newFolio;
            }),
            catchError(error => {
              console.error('FolioStore creation failed', error);
              updateState(store, '[Folio] Create Failed', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
      },

      //#endregion Folio

      //#region Placement

      placementsLoadAll: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            updateState(store, '[Placement] getAllPlacements Start', { isLoading: true });
            return dbFolio.placementsGetAll().pipe(
              map((allPlacements: Placement[]) => {
                updateState(store, '[Placement] getAllPlacements Success', value => ({
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
