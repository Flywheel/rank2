import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '../../core/interfaces/interfaces';
import { FolioService } from './folio.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { LogService } from '../../core/log/log.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const placementInit: Placement = {
  id: 0,
  authorId: 0,
  assetId: 0,
  folioId: 0,
  caption: '',
};

export const folioInit: Folio = {
  id: 0,
  authorId: 0,
  isDefault: false,
  folioName: '',
};
const folioViewInit: FolioView = {
  id: 0,
  authorId: 0,
  isDefault: false,
  folioName: '',
  placementViews: [],
};

export const assetInit = {
  id: 0,
  authorId: 0,
  mediaType: '',
  sourceId: '',
};

export const assetViewInit = {
  id: 0,
  authorId: 0,
  mediaType: '',
  sourceId: '',
  url: '',
  paddingBottom: '',
};

export const FolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools('folios'),
  withState({
    currentFolioView: folioViewInit,
    allDBFolioViews: [folioViewInit],
    allFolios: [folioInit],
    allPlacements: [placementInit],
    allAssets: [assetInit],
    isLoading: false,
    isAddingFolio: false,
    isAddingPlacement: false,
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
      allFolioViews: computed<FolioView[]>(() =>
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

  withMethods(store => {
    const dbFolio = inject(FolioService);
    const logger = inject(LogService);
    return {
      // #region Folio

      LoadAllFolios: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Folio] getAllFolios Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbFolio.allFolios().pipe(
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

      LoadAllFolioViews: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Folio] getAllFolioViews Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbFolio.allFolioViews().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allDBFolioViews: FolioView[]) => {
                  updateState(store, '[Folio] getAllFolioViews Success', value => ({
                    ...value,
                    allDBFolioViews,
                    isLoading: false,
                    //isStartupLoadingComplete: true,
                  }));
                },
              })
            );
          })
        )
      ),

      setCurrentFolioView: rxMethod<number>(
        pipe(
          tap(() => {
            updateState(store, '[Folio] getFolioViewById Start', { isLoading: true });
          }),
          switchMap(folioId => {
            const existingFolioView = store.allDBFolioViews().find(view => view.id === folioId);
            if (existingFolioView) {
              return of(existingFolioView);
            } else {
              const theFolioView = dbFolio.getFolioViewById(folioId).pipe(
                tap({
                  next: (folioView: FolioView) => {
                    updateState(store, '[Folio] Load FolioViewById Success', {
                      allDBFolioViews: [...store.allDBFolioViews(), folioView],
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

      setCurrentFolioView2(folioId: number) {
        const existingFolioView = store.allFolioViews().find(view => view.id === folioId);
        updateState(store, '[Folio] getFolioViewById Start', { currentFolioView: existingFolioView, isLoading: true });
      },

      toggleFolioAdder(state: boolean) {
        updateState(store, '[Folio] toggleFolioAdder', { isAddingFolio: state });
      },

      addFolio(folio: Folio) {
        if (logger.enabled) console.log('addFolio', folio);
        updateState(store, '[Folio] addFolio Pending', { isLoading: true });
        dbFolio
          .folioCreate(folio)
          .pipe(
            tap({
              next: (newFolio: Folio) => {
                if (logger.enabled) console.log('newFolio', newFolio);
                updateState(store, '[Folio] addFolio Success', {
                  allFolios: [...store.allFolios(), newFolio],
                  isLoading: false,
                });
              },
              error: error => {
                if (logger.enabled) console.log('error', error);
                updateState(store, '[Folio] addFolio Failed', { isLoading: false });
              },
            })
          )
          .subscribe();
      },

      //#endregion

      //#region Placement

      Placements: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Placement] getAllPlacements Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbFolio.allPlacements().pipe(
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
            return dbFolio.allPlacementViews().pipe(
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
        if (logger.enabled) console.log('addPlacement', placement);
        updateState(store, '[Placement] addPlacement Pending', { isLoading: true });
        dbFolio
          .PlacementCreate(placement)
          .then(newPlacement => {
            if (logger.enabled) console.log('newPlacement', newPlacement);
            updateState(store, '[Placement] addPlacement Success', {
              allPlacements: [...store.allPlacements(), newPlacement],
              isLoading: false,
            });
          })
          .catch(error => {
            if (logger.enabled) console.log('error', error);
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
            return dbFolio.allAssets().pipe(
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
      store.LoadAllFolios();
      store.Placements();
      store.Assets();
      // store.FolioViews();
      store.setCurrentFolioView2(1);
    },
  })
);
