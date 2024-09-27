import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Asset, Folio, FolioView, Placement, PlacementView } from '../../shared/interfaces/interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FolioService {
  http = inject(HttpClient);

  private folioAPIUrl = `api/folio`;
  private folioViewAPIUrl = `api/folioview`;
  // private folioAPIUrl = `${environment.HOST_DOMAIN}/api/folio`;
  // private folioViewAPIUrl = `${environment.HOST_DOMAIN}/api/folioview`;

  private placementAPIUrl = `api/placement`;
  private placementViewAPIUrl = `api/placementview`;

  private assetAPIUrl = `api/asset`;

  foliosGetAll(): Observable<Folio[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allFolios() ${this.folioAPIUrl}`);
    return this.http.get<Folio[]>(this.folioAPIUrl).pipe(takeUntilDestroyed());
  }

  folioGetById(id: number): Observable<Folio> {
    return this.http.get<Folio>(`${this.folioAPIUrl}/${id}`).pipe(takeUntilDestroyed());
  }

  folioViewsGetAll(): Observable<FolioView[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allFolioViews() ${this.folioViewAPIUrl}`);
    return this.http.get<FolioView[]>(this.folioViewAPIUrl).pipe(takeUntilDestroyed());
  }

  folioViewGetById(id: number): Observable<FolioView> {
    return this.http.get<FolioView>(`${this.folioViewAPIUrl}/${id}`);
  }

  folioCreate({ authorId, isDefault, folioName }: Folio): Observable<Folio> {
    return this.http.post<Folio>(this.folioAPIUrl, { authorId, isDefault, folioName }).pipe(
      tap(data => {
        if (environment.ianConfig.showLogs) console.log('data', data);
      }),
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
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

  placementCreate({ authorId, assetId, folioId, caption }: Placement): Promise<Placement> {
    if (environment.ianConfig.showLogs) console.log('input', caption);
    if (environment.ianConfig.showLogs) console.log(this.folioAPIUrl);
    return new Promise((resolve, reject) => {
      this.http.post<Placement>(this.folioAPIUrl, { authorId, assetId, folioId, caption }).subscribe({
        //this.http.post<Folio>(this.folioAPIUrl, folio).subscribe({
        next: data => {
          if (environment.ianConfig.showLogs) console.log('data', data);
          resolve(data);
        },
        error: error => {
          if (environment.ianConfig.showLogs) console.log('error', error);
          reject(error);
        },
      });
    });
  }

  assetsGetAll(): Observable<Asset[]> {
    if (environment.ianConfig.showLogs) console.log(`folioService.allAssets() ${this.assetAPIUrl}`);
    return this.http.get<Asset[]>(this.assetAPIUrl).pipe(takeUntilDestroyed());
  }
}
