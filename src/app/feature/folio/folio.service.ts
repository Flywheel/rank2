import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Asset, Folio, FolioView, Placement } from '../../core/models/interfaces';
import { catchError, exhaustMap, Observable, map, timeout, retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { ErrorService } from '../../core/services/error.service';

@Injectable({
  providedIn: 'root',
})
export class FolioService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);
  err = this.errorService.handleHttpErrorResponse;

  private folioAPIUrl = `api/folio`;
  private folioViewAPIUrl = `api/folioview`;

  private placementAPIUrl = `api/placement`;
  private assetAPIUrl = `api/asset`;

  createFolioAsRoot({ authorId, folioName }: Folio): Observable<Folio> {
    return this.http.post<Folio>(this.folioAPIUrl, { authorId, folioName }).pipe(
      timeout(5000),
      retry(2),
      catchError(error => this.err(error, 'Folio creation failed'))
    );
  }

  createFolioAsAsset(folioPrep: Partial<Folio>): Observable<{ newFolio: Folio; newAsset: Asset; newPlacement: Placement }> {
    return this.http.post<Folio>(this.folioAPIUrl, folioPrep).pipe(
      timeout(5000),
      retry(2),
      exhaustMap((newFolio: Folio) => {
        const assetPrep: Asset = {
          id: 0,
          mediaType: 'folio',
          sourceId: newFolio.id.toString() || '0',
          authorId: folioPrep.authorId!,
        };
        return this.assetCreate(assetPrep).pipe(
          exhaustMap((newAsset: Asset) => {
            const placementPrep: Placement = {
              id: 0,
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
      catchError(error => this.err(error, 'Folio creation failed'))
    );
  }

  placementCreate({ authorId, assetId, folioId, caption }: Placement): Observable<Placement> {
    const id = undefined;
    return this.http
      .post<Placement>(this.placementAPIUrl, { id, authorId, assetId, folioId, caption })
      .pipe(catchError(error => this.err(error, 'Folio creation failed')));
  }

  assetCreate({ authorId, mediaType, sourceId }: Asset): Observable<Asset> {
    return this.http
      .post<Asset>(this.assetAPIUrl, { authorId, mediaType, sourceId })
      .pipe(catchError(error => this.err(error, 'Asset creation failed')));
  }

  createPlacementAsAsset(assetData: Asset, folioId: number, caption: string): Observable<{ newAsset: Asset; newPlacement: Placement }> {
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
      catchError(error => this.err(error, 'Placement creation failed'))
    );
  }

  placementsGetAll(): Observable<Placement[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allPlacements() ${this.placementAPIUrl}`);
    return this.http.get<Placement[]>(this.placementAPIUrl).pipe(takeUntilDestroyed());
  }

  assetsGetAll(): Observable<Asset[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allAssets() ${this.assetAPIUrl}`);
    return this.http.get<Asset[]>(this.assetAPIUrl).pipe(takeUntilDestroyed());
  }
  foliosGetAll(): Observable<Folio[]> {
    return this.http.get<Folio[]>(this.folioAPIUrl);
  }

  folioGetById(id: number): Observable<Folio> {
    return this.http.get<Folio>(`${this.folioAPIUrl}/${id}`);
  }

  folioViewGetById(id: number): Observable<FolioView> {
    return this.http.get<FolioView>(`${this.folioViewAPIUrl}/${id}`);
  }
}
