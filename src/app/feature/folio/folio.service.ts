import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Asset, Folio, FolioView, Placement, PlacementView } from '../../core/models/interfaces';
import { catchError, exhaustMap, Observable, throwError, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FolioService {
  http = inject(HttpClient);

  private folioAPIUrl = `api/folio`;
  private folioViewAPIUrl = `api/folioview`;

  private placementAPIUrl = `api/placement`;
  private placementViewAPIUrl = `api/placementview`;

  private assetAPIUrl = `api/asset`;
  private assetViewAPIUrl = `api/assetview`;

  foliosGetAll(): Observable<Folio[]> {
    return this.http.get<Folio[]>(this.folioAPIUrl);
  }

  folioGetById(id: number): Observable<Folio> {
    return this.http.get<Folio>(`${this.folioAPIUrl}/${id}`);
  }

  folioViewGetById(id: number): Observable<FolioView> {
    return this.http.get<FolioView>(`${this.folioViewAPIUrl}/${id}`);
  }

  folioCreateForNewAuthor_PostingView({ authorId, folioName }: Folio): Observable<Folio> {
    return this.http.post<Folio>(this.folioAPIUrl, { authorId, folioName }).pipe(
      exhaustMap(newFolio => {
        if (environment.ianConfig.showLogs) console.log('data', newFolio);
        return this.http.post<FolioView>(this.folioViewAPIUrl, { authorId, folioName, placementViews: [] }).pipe(
          map(folioViewData => {
            if (environment.ianConfig.showLogs) console.log('folioViewData', folioViewData);
            return newFolio;
          })
        );
      }),
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  folioCreateWithParent(folioPrep: Partial<Folio>): Observable<{ newFolio: Folio; newAsset: Asset; newPlacement: Placement }> {
    return this.http.post<Folio>(this.folioAPIUrl, folioPrep).pipe(
      exhaustMap((newFolio: Folio) => {
        const newAsset: Asset = {
          id: 0, // Assuming backend assigns the ID
          mediaType: 'folio',
          sourceId: newFolio.id.toString() || '0',
          authorId: folioPrep.authorId!,
        };
        return this.assetCreate(newAsset).pipe(
          exhaustMap((newAsset: Asset) => {
            const placementPrep: Placement = {
              id: 0, // Assuming backend assigns the ID
              folioId: folioPrep.parentFolioId!,
              caption: folioPrep.folioName?.trim() || 'New Folio',
              assetId: newAsset.id,
              authorId: folioPrep.authorId!,
            };
            return this.placementCreate(placementPrep).pipe(
              map((newPlacement: Placement) => ({
                newFolio,
                newAsset,
                newPlacement,
              }))
            );
          })
        );
      }),
      catchError(error => {
        console.error('Folio creation failed', error);
        return throwError(() => new Error('Folio creation failed'));
      })
    );
  }

  placementsGetAll(): Observable<Placement[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allPlacements() ${this.placementAPIUrl}`);
    return this.http.get<Placement[]>(this.placementAPIUrl).pipe(takeUntilDestroyed());
  }

  placementViewsGetAll(): Observable<PlacementView[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allFolioViews() ${this.placementViewAPIUrl}`);
    return this.http.get<PlacementView[]>(this.placementViewAPIUrl).pipe(takeUntilDestroyed());
  }

  placementCreate({ authorId, assetId, folioId, caption }: Placement): Observable<Placement> {
    const id = undefined;
    return this.http.post<Placement>(this.placementAPIUrl, { id, authorId, assetId, folioId, caption }).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('Placement Create failed'));
      })
    );
  }

  // placementCreate(placement: Placement): Observable<Placement> {
  //   return this.http.post<Placement>(this.placementAPIUrl, placement).pipe(
  //     catchError(error => {
  //       if (environment.ianConfig.showLogs) console.error('Placement Create failed', error);
  //       return throwError(() => new Error('Placement Create failed'));
  //     })
  //   );
  // }

  assetsGetAll(): Observable<Asset[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allAssets() ${this.assetAPIUrl}`);
    return this.http.get<Asset[]>(this.assetAPIUrl).pipe(takeUntilDestroyed());
  }

  assetCreate({ authorId, mediaType, sourceId }: Asset): Observable<Asset> {
    return this.http.post<Asset>(this.assetAPIUrl, { authorId, mediaType, sourceId }).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('Asset Create failed'));
      })
    );
  }

  assetCreateWithPlacement(assetData: Asset, folioId: number, caption: string): Observable<{ newAsset: Asset; newPlacement: Placement }> {
    return this.assetCreate(assetData).pipe(
      exhaustMap((createdAsset: Asset) => {
        const placement: Placement = {
          id: 0, // Assuming backend assigns the ID
          folioId: folioId,
          caption: caption,
          assetId: createdAsset.id,
          authorId: assetData.authorId!,
        };
        return this.placementCreate(placement).pipe(
          map((createdPlacement: Placement) => ({
            newAsset: createdAsset,
            newPlacement: createdPlacement,
          }))
        );
      }),
      catchError(error => {
        console.error('Folio creation failed', error);
        return throwError(() => new Error('Folio creation failed'));
      })
    );
  }
}
