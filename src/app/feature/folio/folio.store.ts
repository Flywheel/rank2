import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '../../core/interfaces/interfaces';
import { FolioService } from './folio.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

const assetInit: Asset = {
  id: 0,
  authorId: '',
  mediaType: '',
  sourceId: '',
};

const assetViewInit: AssetView = {
  id: 0,
  authorId: '1',
  mediaType: '1',
  sourceId: '',
  url: '',
  paddingBottom: '',
};

const placementInit: Placement = {
  id: 0,
  authorId: '',
  assetId: 0,
  folioId: 0,
  caption: '',
};

const placementViewInit: PlacementView = {
  id: 0,
  authorId: '',
  assetId: 0,
  folioId: 0,
  caption: '',
  asset: assetViewInit,
};

export const folioInit: Folio = {
  id: 0,
  authorId: '',
  isDefault: false,
  folioName: '',
};
const folioViewInit: FolioView = {
  id: 0,
  authorId: '',
  isDefault: false,
  folioName: '',
  placementViews: [],
};

export const FolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools('folios'),
  withState({
    currentFolioView: folioViewInit,
    allFolioViews: [folioViewInit],
    allFolios: [folioInit],
    allPlacements: [placementInit],
    allPlacementViews: [placementViewInit],
    allAssets: [assetInit],

    isLoading: false,
    isAddingFolio: false,
    isAddingPlacement: false,
  }),

  withStorageSync({
    key: 'folios',
    autoSync: false,
  }),

  // withComputed(store => {
  //   return {
  //     allAssetViews: computed<AssetView[]>(() =>
  //       store.allAssets().map(asset => ({
  //         ...asset,
  //         url: '',
  //         paddingBottom: '',
  //       }))
  //     ),
  //   };
  // }),

  // withComputed(store => {
  //   return {
  //     allPlacementViews: computed<PlacementView[]>(() =>
  //       store.allPlacements().map(placement => ({
  //         ...placement,
  //         asset: store.allAssetViews().find(a => a.id === placement.assetId) ?? assetViewInit,
  //       }))
  //     ),
  //   };
  // }),

  // withComputed(store => {
  //   return {
  //     allComputedFolioViews: computed<FolioView[]>(() =>
  //       store.allFolios().map(folio => {
  //         const placementViews = store.allPlacementViews().filter(placement => placement.folioId === folio.id);
  //         return {
  //           ...folio,
  //           placementViews,
  //         };
  //       })
  //     ),
  //   };
  // }),

  withMethods(store => {
    const dbFolio = inject(FolioService);
    return {
      // #region Folio

      loadAllFolios: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Folio] getAllFolios Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbFolio.foliosGetAll().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allFolios: Folio[]) => {
                  updateState(store, '[Folio] getAllFolios Success', value => ({
                    ...value,
                    allFolios,
                    isLoading: false,
                  }));
                },
              })
            );
          })
        )
      ),

      // loadAllFolioViews: rxMethod<void>(
      //   pipe(
      //     tap(() => {
      //       updateState(store, '[Folio] getAllFolioViews Start', { isLoading: true });
      //     }),
      //     exhaustMap(() => {
      //       return dbFolio.folioViewsGetAll().pipe(
      //         takeUntilDestroyed(),
      //         tap({
      //           next: (allDBFolioViews: FolioView[]) => {
      //             updateState(store, '[Folio] getAllFolioViews Success', value => ({
      //               ...value,
      //               allDBFolioViews,
      //               isLoading: false,
      //               //isStartupLoadingComplete: true,
      //             }));
      //           },
      //         })
      //       );
      //     })
      //   )
      // ),

      setCurrentFolioView: rxMethod<number>(
        pipe(
          tap(() => {
            updateState(store, '[Folio] getFolioViewById Start', { isLoading: true });
          }),
          switchMap(folioId => {
            if (environment.ianConfig.showLogs) console.log('addPlacement', folioId);
            const existingFolioView = store.allFolioViews().find(view => view.id === folioId);
            if (existingFolioView) {
              return of(existingFolioView);
            } else {
              const theFolioView = dbFolio.folioViewGetById(folioId).pipe(
                tap({
                  next: (folioView: FolioView) => {
                    updateState(store, '[Folio] Load FolioViewById Success', {
                      allFolioViews: [...store.allFolioViews(), folioView],
                    });
                  },
                })
              );
              return theFolioView;
            }
          }),
          tap(folioView =>
            updateState(store, '[Folio] getFolioViewById Success', {
              currentFolioView: folioView,
              //  folioSlate: store.allFolioSlates().filter(a => a.folioId === folioView.id)[0] ?? slateViewInit,
              isLoading: false,
            })
          )
        )
      ),

      toggleFolioAdder(state: boolean) {
        updateState(store, '[Folio] toggleFolioAdder', { isAddingFolio: state });
      },

      addFolio(folio: Folio) {
        if (environment.ianConfig.showLogs) console.log('addFolio', folio);
        updateState(store, '[Folio] addFolio Pending', { isLoading: true });
        dbFolio
          .folioCreate(folio)
          .pipe(
            tap({
              next: (newFolio: Folio) => {
                if (environment.ianConfig.showLogs) console.log('newFolio', newFolio);
                updateState(store, '[Folio] addFolio Success', {
                  allFolios: [...store.allFolios(), newFolio],
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

      //#endregion

      //#region Placement

      loadAllPlacements: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Placement] getAllPlacements Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbFolio.placementsGetAll().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allPlacements: Placement[]) => {
                  updateState(store, '[Placement] getAllPlacements Success', value => ({
                    ...value,
                    allPlacements,
                    isLoading: false,
                  }));
                },
              })
            );
          })
        )
      ),

      PlacementViews: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Placement] getAllPlacementViews Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbFolio.placementViewsGetAll().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allPlacements: PlacementView[]) => {
                  updateState(store, '[Placement] getAllPlacementViews Success', value => ({
                    ...value,
                    allPlacements,
                    isLoading: false,
                  }));
                },
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
            if (environment.ianConfig.showLogs) {
              console.log(store.allPlacements());
              // console.log(store.allPlacementViews());
            }
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
              takeUntilDestroyed(),
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
      // store.FolioViews();
      store.setCurrentFolioView(1);
    },
  })
);
