import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Asset, AssetView, Folio, FolioView, Placement, PlacementView } from '../../core/models/interfaces';
import { assetInit, assetViewInit, folioInit, folioViewInit, placementInit } from '../../core/models/initValues';
import { FolioService } from './folio.service';
import { computed, inject } from '@angular/core';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { ErrorService } from '../../core/services/error.service';

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
    error: null as string | null,
  }),

  withStorageSync({
    key: 'folios',
    autoSync: false,
  }),

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

  withMethods(store => {
    const dbFolio = inject(FolioService);

    const errorService = inject(ErrorService);
    const err = errorService.handleSignalStoreResponse;

    // const clearError = () => setError(null);
    return {
      toggleFolioAdder(state: boolean) {
        updateState(store, `[Folio] Is Adding  ${state}`, { isAddingFolio: state });
      },

      setFolioSelected(folioId: number) {
        updateState(store, `[Folio] Select By Id  ${folioId}`, { folioIdSelected: folioId });
      },

      async createFolioAsRoot(folioPrep: Folio): Promise<void> {
        updateState(store, '[Folio-Root] Create Start', { isLoading: true });
        try {
          const newFolio = await firstValueFrom(dbFolio.createFolioAsRoot(folioPrep));
          updateState(store, '[Folio-Root] Create Success', {
            folios: [...store.folios(), newFolio],
            isLoading: false,
          });
          store.writeToStorage();
        } catch (error) {
          err(error, '[Folio-Root] Create Failed');
          updateState(store, '[Folio-Root] Create Failed', { isLoading: false });
        }
      },

      async createFolioAsAsset(folioPrep: Partial<Folio>): Promise<{ newFolio: Folio; newAsset: Asset; newPlacement: Placement }> {
        updateState(store, '[Folio-Branch] Create Start', { isLoading: true });
        const { newFolio, newAsset, newPlacement } = await firstValueFrom(
          dbFolio.createFolioAsAsset(folioPrep).pipe(
            catchError(error => {
              updateState(store, '[Folio-Branch] Create Failed', { isLoading: false });
              return throwError(error);
            })
          )
        );
        updateState(store, '[Folio-Branch] Create Success', {
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
      },

      async createPlacementWithAsset(folioId: number, caption: string, assetPrep: Asset) {
        updateState(store, '[Asset-Media] Create Start', { isLoading: true });
        dbFolio
          .createPlacementAsAsset(assetPrep, folioId, caption)
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
              return error;
            })
          )
          .subscribe();
      },

      //#endregion Folio

      //#region Placement

      togglePlacementAdder(state: boolean) {
        updateState(store, `[Placement] Is Adding = ${state}`, { isAddingPlacement: state });
      },

      async createPlacement(placement: Placement) {
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
              return error;
            })
          )
          .subscribe();
      },

      //#endregion

      //#region Asset

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
              return error;
            })
          )
          .subscribe();
      },

      //#endregion
    };
  })
);
