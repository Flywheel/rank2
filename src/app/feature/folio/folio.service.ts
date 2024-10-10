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

  foliosGetAll(): Observable<Folio[]> {
    return this.http.get<Folio[]>(this.folioAPIUrl);
  }

  folioGetById(id: number): Observable<Folio> {
    return this.http.get<Folio>(`${this.folioAPIUrl}/${id}`);
  }

  folioViewGetById(id: number): Observable<FolioView> {
    return this.http.get<FolioView>(`${this.folioViewAPIUrl}/${id}`);
  }

  folioCreate({ authorId, folioName }: Folio): Observable<Folio> {
    return this.http.post<Folio>(this.folioAPIUrl, { authorId, folioName }).pipe(
      exhaustMap(data => {
        if (environment.ianConfig.showLogs) console.log('data', data);
        return this.http.post<FolioView>(this.folioViewAPIUrl, { authorId, folioName, placementViews: [] }).pipe(
          map(folioViewData => {
            if (environment.ianConfig.showLogs) console.log('folioViewData', folioViewData);
            return data;
          })
        );
      }),
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  folioCreateWithParent(folioData: Partial<Folio>): Observable<{ newFolio: Folio; newAsset: Asset; newPlacement: Placement }> {
    return this.http.post<Folio>(this.folioAPIUrl, folioData).pipe(
      exhaustMap((newFolio: Folio) => {
        const newAsset: Asset = {
          id: 0, // Assuming backend assigns the ID
          mediaType: 'folio',
          sourceId: folioData.parentFolioId?.toString() || '0',
          authorId: folioData.authorId!,
        };
        return this.assetCreate(newAsset).pipe(
          exhaustMap((createdAsset: Asset) => {
            const placement: Placement = {
              id: 0, // Assuming backend assigns the ID
              folioId: folioData.parentFolioId!,
              caption: folioData.folioName?.trim() || 'New Folio',
              assetId: createdAsset.id,
              authorId: folioData.authorId!,
            };
            return this.placementCreate(placement).pipe(
              map(() => ({
                newFolio,
                newAsset: createdAsset,
                newPlacement: placement,
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
  folioCreateWithParent2(folioData: Partial<Folio>): Observable<Folio> {
    return this.http.post<Folio>(this.folioAPIUrl, folioData).pipe(
      exhaustMap((newFolio: Folio) => {
        const newAsset: Asset = {
          id: 0,
          mediaType: 'folio',
          sourceId: folioData.parentFolioId!.toString(),
          authorId: folioData.authorId!,
        };
        return this.assetCreate(newAsset).pipe(
          exhaustMap((createdAsset: Asset) => {
            const placement: Placement = {
              id: 0,
              folioId: folioData.parentFolioId!,
              caption: folioData.folioName?.trim() || 'New Folio',
              assetId: createdAsset.id,
              authorId: folioData.authorId!,
            };
            return this.placementCreate(placement).pipe(map(() => newFolio));
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

  placementCreate3(placement: Placement): Observable<Placement> {
    return this.http.post<Placement>(this.placementAPIUrl, placement).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('Placement Create failed'));
      })
    );
  }
  placementCreate({ authorId, assetId, folioId, caption }: Placement): Observable<Placement> {
    return this.http.post<Placement>(this.placementAPIUrl, { authorId, assetId, folioId, caption }).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('Placement Create failed'));
      })
    );
  }
  placementCreate2({ authorId, assetId, folioId, caption }: Placement): Observable<Placement> {
    return this.http.post<Placement>(this.folioAPIUrl, { authorId, assetId, folioId, caption }).pipe(
      exhaustMap(data => {
        return this.http.post<Placement>(this.folioAPIUrl, { authorId, assetId, folioId, caption }).pipe(
          map(folioViewData => {
            if (environment.ianConfig.showLogs) console.log('folioViewData', folioViewData);
            return data;
          })
        );
      }),
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  assetsGetAll(): Observable<Asset[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allAssets() ${this.assetAPIUrl}`);
    return this.http.get<Asset[]>(this.assetAPIUrl).pipe(takeUntilDestroyed());
  }

  // assetCreate2({ authorId, mediaType, sourceId }: Asset): Observable<Asset> {
  //   return this.http.post<Asset>(this.folioAPIUrl, { authorId, mediaType, sourceId }).pipe(
  //     exhaustMap(data => {
  //       return this.http.post<Asset>(this.folioAPIUrl, { authorId, mediaType, sourceId }).pipe(
  //         map(newAsset => {
  //           if (environment.ianConfig.showLogs) console.log('newAsset ', newAsset);
  //           return data;
  //         })
  //       );
  //     }),
  //     catchError(error => {
  //       if (environment.ianConfig.showLogs) console.log('error', error);
  //       return throwError(() => new Error('newAsset Create failed'));
  //     })
  //   );
  // }

  assetCreate(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(this.assetAPIUrl, asset).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('Asset Create failed'));
      })
    );
  }
}
