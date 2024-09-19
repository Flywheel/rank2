import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState } from '@angular-architects/ngrx-toolkit';
import { Folio, FolioView, Placement, PlacementView } from '../../core/interfaces/interfaces';
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
  placements: [],
};

export const FolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools('folios'),
  withState({
    currentFolioView: folioViewInit,
    allFolioViews: [folioViewInit],
    allFolios: [folioInit],
    allPlacements: [placementInit],
    isLoading: false,
  }),
  withComputed(store => {
    return {
      allFolioPlacements: computed<PlacementView[]>(() =>
        store
          .allFolioViews()
          .map(c => c.placements)
          .flat()
      ),
    };
  }),
  withMethods(store => {
    const dbFolio = inject(FolioService);
    const logger = inject(LogService);
    return {
      Folios: rxMethod<void>(
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

      FolioViews: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Ballot] getAllFolioViews Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbFolio.allFolioViews().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allFolioViews: FolioView[]) => {
                  updateState(store, '[Ballot] getAllFolioViews Success', value => ({
                    ...value,
                    allFolioViews,
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
            updateState(store, '[Ballot] getFolioViewById Start', { isLoading: true });
          }),
          switchMap(folioId => {
            const existingFolioView = store.allFolioViews().find(view => view.id === folioId);
            if (existingFolioView) {
              return of(existingFolioView);
            } else {
              const theFolioView = dbFolio.getFolioViewById(folioId).pipe(
                tap({
                  next: (folioView: FolioView) => {
                    updateState(store, '[Ballot] Load FolioViewById Success', {
                      allFolioViews: [...store.allFolioViews(), folioView],
                    });
                  },
                })
              );
              return theFolioView;
            }
          }),
          tap(folioView =>
            updateState(store, '[Ballot] getFolioViewById Success', {
              currentFolioView: folioView,
              //  folioSlate: store.allFolioSlates().filter(a => a.folioId === folioView.id)[0] ?? slateViewInit,
              isLoading: false,
            })
          )
        )
      ),

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
    };
  }),

  withHooks({
    onInit(store) {
      store.Folios();
      // store.FolioViews();
      store.setCurrentFolioView(1);
    },
  })
);
