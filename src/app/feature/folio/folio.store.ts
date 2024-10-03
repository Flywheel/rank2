import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '../../core/interfaces/interfaces';
import { assetInit, assetViewInit, folioInit, folioViewInit, placementInit } from '../../core/interfaces/initValues';
import { FolioService } from './folio.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, pipe, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const FolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools('folios'),
  withState({
    folioIdSelected: 0,
    allFolios: [folioInit],
    allPlacements: [placementInit],
    allAssets: [assetInit],
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
        store.allAssets().map(asset => ({
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
        store.allPlacements().map(placement => ({
          ...placement,
          asset: store.allAssetViews().find(a => a.id === placement.assetId) ?? assetViewInit,
        }))
      ),
    };
  }),

  withComputed(store => {
    return {
      allComputedFolioViews: computed<FolioView[]>(() =>
        store.allFolios().map(folio => {
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
    const dbFolio = inject(FolioService);
    return {
      // #region Folio
      loadAllFolios: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            updateState(store, '[Folio] getAllFolios Start', { isLoading: true });
            return dbFolio.foliosGetAll().pipe(
              map((allFolios: Folio[]) => {
                updateState(store, '[Folio] getAllFolios Success', value => ({
                  ...value,
                  allFolios,
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

      addFolio(folio: Folio) {
        if (environment.ianConfig.showLogs) console.log('addFolio', folio);
        updateState(store, '[Folio] addFolio Pending', { isLoading: true });
        dbFolio
          .folioCreate(folio)
          .pipe(
            map((newFolio: Folio) => {
              updateState(store, '[Folio] addFolio Success', {
                allFolios: [...store.allFolios(), newFolio],
                isLoading: false,
              });
              return newFolio;
            }),
            catchError(error => {
              updateState(store, '[Folio] addFolio Failed', { isLoading: false });
              return throwError(error);
            })
          )
          .subscribe();
      },

      //#endregion Folio

      //#region Placement

      loadAllPlacements: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            updateState(store, '[Placement] getAllPlacements Start', { isLoading: true });
            return dbFolio.placementsGetAll().pipe(
              map((allPlacements: Placement[]) => {
                updateState(store, '[Placement] getAllPlacements Success', value => ({
                  ...value,
                  allPlacements,
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

      addPlacement(placement: Placement) {
        if (environment.ianConfig.showLogs) console.log('addPlacement', placement);
        updateState(store, '[Placement] addPlacement Pending', { isLoading: true });
        dbFolio
          .placementCreate(placement)
          .then(newPlacement => {
            if (environment.ianConfig.showLogs) console.log('newPlacement', newPlacement);
            updateState(store, '[Placement] addPlacement Success', {
              allPlacements: [...store.allPlacements(), newPlacement],
              isLoading: false,
            });
          })
          .catch(error => {
            if (environment.ianConfig.showLogs) console.log('error', error);
            updateState(store, '[Placement] addPlacement Failed', { isLoading: false });
          });
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
                    allAssets,
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
    onInit(store) {
      store.loadAllFolios();
      store.loadAllPlacements();
      store.Assets();
    },
  })
);
