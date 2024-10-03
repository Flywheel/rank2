import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Asset, Folio, FolioView, Placement, PlacementView } from '../../core/interfaces/interfaces';
import { catchError, exhaustMap, Observable, tap, throwError, map } from 'rxjs';
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
    return this.http.get<Folio[]>(this.folioAPIUrl);
  }

  folioGetById(id: number): Observable<Folio> {
    return this.http.get<Folio>(`${this.folioAPIUrl}/${id}`);
  }

  folioViewGetById(id: number): Observable<FolioView> {
    return this.http.get<FolioView>(`${this.folioViewAPIUrl}/${id}`);
  }

  folioCreate1({ authorId, isDefault, folioName }: Folio): Observable<Folio> {
    return this.http.post<Folio>(this.folioAPIUrl, { authorId, isDefault, folioName }).pipe(
      tap(data => {
        if (environment.ianConfig.showLogs) console.log('data', data);
        this.http.post<FolioView>(this.folioViewAPIUrl, { authorId, isDefault, folioName, placementViews: [] }).subscribe({
          next: data => {
            if (environment.ianConfig.showLogs) console.log('data', data);
          },
        });
      }),
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  folioCreate({ authorId, isDefault, folioName }: Folio): Observable<Folio> {
    return this.http.post<Folio>(this.folioAPIUrl, { authorId, isDefault, folioName }).pipe(
      exhaustMap(data => {
        if (environment.ianConfig.showLogs) console.log('data', data);
        return this.http.post<FolioView>(this.folioViewAPIUrl, { authorId, isDefault, folioName, placementViews: [] }).pipe(
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
