import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Folio, FolioView, Placement } from '../../core/interfaces/interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LogService } from '../../core/log/log.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class FolioService {
  http = inject(HttpClient);
  logger = inject(LogService);

  private folioAPIUrl = `api/folio`;
  private folioViewAPIUrl = `api/folioview`;
  // private folioAPIUrl = `${environment.HOST_DOMAIN}/api/folio`;
  // private folioViewAPIUrl = `${environment.HOST_DOMAIN}/api/folioview`;

  allFolios(): Observable<Folio[]> {
    if (this.logger.enabled) console.log(`folioService.allFolios() ${this.folioAPIUrl}`);
    return this.http.get<Folio[]>(this.folioAPIUrl).pipe(takeUntilDestroyed());
  }

  getFolioById(id: number): Observable<Folio> {
    return this.http.get<Folio>(`${this.folioAPIUrl}/${id}`).pipe(takeUntilDestroyed());
  }

  allFolioViews(): Observable<FolioView[]> {
    if (this.logger.enabled) console.log(`folioService.allFolioViews() ${this.folioViewAPIUrl}`);
    return this.http.get<FolioView[]>(this.folioViewAPIUrl).pipe(takeUntilDestroyed());
  }

  getFolioViewById(id: number): Observable<FolioView> {
    return this.http.get<FolioView>(`${this.folioViewAPIUrl}/${id}`);
  }

  folioCreate({ authorId, isDefault, folioTopic: name }: Folio): Observable<Folio> {
    return this.http.post<Folio>(this.folioAPIUrl, { authorId, isDefault, name }).pipe(
      tap(data => {
        if (this.logger.enabled) console.log('data', data);
      }),
      catchError(error => {
        if (this.logger.enabled) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  PlacementCreate({ authorId, assetId, folioId, caption }: Placement): Promise<Placement> {
    if (this.logger.enabled) console.log('input', caption);
    if (this.logger.enabled) console.log(this.folioAPIUrl);
    return new Promise((resolve, reject) => {
      this.http.post<Placement>(this.folioAPIUrl, { authorId, assetId, folioId, caption }).subscribe({
        //this.http.post<Folio>(this.folioAPIUrl, folio).subscribe({
        next: data => {
          if (this.logger.enabled) console.log('data', data);
          resolve(data);
        },
        error: error => {
          if (this.logger.enabled) console.log('error', error);
          reject(error);
        },
      });
    });
  }
}
