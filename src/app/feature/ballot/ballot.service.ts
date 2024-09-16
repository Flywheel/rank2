import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Contest, ContestView, Placement } from '../../core/interfaces/interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LogService } from '../../core/log/log.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class BallotService {
  http = inject(HttpClient);
  logger = inject(LogService);

  private contestAPIUrl = `api/contest`;
  private contestViewAPIUrl = `api/contestview`;
  // private contestAPIUrl = `${environment.HOST_DOMAIN}/api/contest`;
  // private contestViewAPIUrl = `${environment.HOST_DOMAIN}/api/contestview`;

  allContests(): Observable<Contest[]> {
    if (this.logger.enabled) console.log(`ballotsService.allContests() ${this.contestAPIUrl}`);
    return this.http.get<Contest[]>(this.contestAPIUrl).pipe(takeUntilDestroyed());
  }

  getContestById(id: number): Observable<Contest> {
    return this.http.get<Contest>(`${this.contestAPIUrl}/${id}`).pipe(takeUntilDestroyed());
  }

  allContestViews(): Observable<ContestView[]> {
    if (this.logger.enabled) console.log(`ballotsService.allContestViews() ${this.contestViewAPIUrl}`);
    return this.http.get<ContestView[]>(this.contestViewAPIUrl).pipe(takeUntilDestroyed());
  }

  getContestViewById(id: number): Observable<ContestView> {
    return this.http.get<ContestView>(`${this.contestViewAPIUrl}/${id}`);
  }

  contestCreate({ closes, opens, contestTitle, contestDescription, authorId, topSlateId }: Contest): Observable<Contest> {
    return this.http.post<Contest>(this.contestAPIUrl, { closes, opens, contestTitle, contestDescription, authorId, topSlateId }).pipe(
      tap(data => {
        if (this.logger.enabled) console.log('data', data);
      }),
      catchError(error => {
        if (this.logger.enabled) console.log('error', error);
        return throwError(() => new Error('ContestCreate failed'));
      })
    );
  }

  PlacementCreate({ authorId, assetId, folioId, caption }: Placement): Promise<Placement> {
    //ContestsCreate(contest: Contest): Promise<Contest> {
    if (this.logger.enabled) console.log('input', caption);
    if (this.logger.enabled) console.log(this.contestAPIUrl);
    return new Promise((resolve, reject) => {
      this.http.post<Placement>(this.contestAPIUrl, { authorId, assetId, folioId, caption }).subscribe({
        //this.http.post<Contest>(this.contestAPIUrl, contest).subscribe({
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

  // getAllContestViews(): Promise<ContestView[]> {
  //   return new Promise((resolve, reject) => {
  //     //    setTimeout(() => {
  //     this.http.get<ContestView[]>(this.contestViewAPIUrl).subscribe({
  //       next: data => {
  //         resolve(data);
  //       },
  //       error: error => {
  //         if (this.logger.enabled)  console.log('error', error);
  //         reject(error);
  //       },
  //     });
  //   });
  // }

  // ContestGet(): Promise<Contest[]> {
  //   if (this.logger.enabled)  console.log(`ballotsService.ContestGet() ${this.contestAPIUrl}`);
  //   return new Promise((resolve, reject) => {
  //     if (this.logger.enabled)  console.log(`ballotsService.ContestGet() START PROMISE ${this.contestAPIUrl}`);
  //     setTimeout(() => {
  //       this.http.get<Contest[]>(this.contestAPIUrl).subscribe({
  //         next: data => {
  //           if (this.logger.enabled)  console.log(`ballotsService.ContestGet() Resolved`);
  //           resolve(data);
  //         },
  //         error: error => {
  //           if (this.logger.enabled)  console.log('error', error);
  //           reject(error);
  //         },
  //       });
  //     }, 500);
  //   });
  // }

  ContestCreateOld({ closes, opens, contestTitle, contestDescription, authorId, topSlateId }: Contest): Promise<Contest> {
    if (this.logger.enabled) console.log('input', contestTitle);
    if (this.logger.enabled) console.log(this.contestAPIUrl);
    return new Promise((resolve, reject) => {
      this.http.post<Contest>(this.contestAPIUrl, { closes, opens, contestTitle, contestDescription, authorId, topSlateId }).subscribe({
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
