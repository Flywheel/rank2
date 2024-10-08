import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '../../core/interfaces/interfaces';
import { assetInit, assetViewInit, folioInit, folioViewInit, placementInit } from '../../core/interfaces/initValues';
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
  }),

  withStorageSync({
    key: 'folios',
    autoSync: false,
  }),

  withComputed(store => {
    return {
      allAssetViews: computed<AssetView[]>(() =>
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
      allPlacementViews: computed<PlacementView[]>(() =>
        store.placements().map(placement => ({
          ...placement,
          asset: store.allAssetViews().find(a => a.id === placement.assetId) ?? assetViewInit,
        }))
      ),
    };
  }),

  withComputed(store => {
    return {
      allComputedFolioViews: computed<FolioView[]>(() =>
        store.folios().map(folio => {
          const placementViews = store.allPlacementViews().filter(placement => placement.folioId === folio.id);
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
        return store.allComputedFolioViews().find(folio => folio.id === store.folioIdSelected()) ?? folioViewInit;
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
        updateState(store, '[Folio] toggleFolioAdder', { isAddingFolio: state });
      },

      setFolioSelected(folioId: number) {
        updateState(store, '[Folio] setFolioSelected', { folioIdSelected: folioId });
      },

      folioCreate(folio: Folio) {
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
              updateState(store, '[Folio] Create Success', {
                placements: [...store.placements(), newPlacement],
                isLoading: false,
              });
              store.writeToStorage();
              return newPlacement;
            }),
            catchError(error => {
              updateState(store, '[Folio] Create Failed', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
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
