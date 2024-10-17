import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pitch, ContestView, FolioView, Slate } from '../../core/models/interfaces';
import { catchError, exhaustMap, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContestService {
  http = inject(HttpClient);

  private contestAPIUrl = `api/contest`;
  private contestViewAPIUrl = `api/contestview`;
  private slateAPIUrl = `api/slate`;
  private slateViewAPIUrl = `api/slateview`;
  // private contestAPIUrl = `${environment.HOST_DOMAIN}/api/contest`;
  // private contestViewAPIUrl = `${environment.HOST_DOMAIN}/api/contestview`;

  contestsGetAll(): Observable<Pitch[]> {
    if (environment.ianConfig.showLogs) console.log(`ballotsService.allContests() ${this.contestAPIUrl}`);
    return this.http.get<Pitch[]>(this.contestAPIUrl);
  }

  contestGetById(id: number): Observable<Pitch> {
    return this.http.get<Pitch>(`${this.contestAPIUrl}/${id}`);
  }

  contestViewsGetAll(): Observable<ContestView[]> {
    if (environment.ianConfig.showLogs) console.log(`ballotsService.allContestViews() ${this.contestViewAPIUrl}`);
    return this.http.get<ContestView[]>(this.contestViewAPIUrl);
  }

  contestViewGetById(id: number): Observable<ContestView> {
    return this.http.get<ContestView>(`${this.contestViewAPIUrl}/${id}`);
  }

  contestCreate({ closes, opens, contestTitle, contestDescription, authorId }: Pitch): Observable<Pitch> {
    return this.http.post<Pitch>(this.contestAPIUrl, { closes, opens, contestTitle, contestDescription, authorId }).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  slateCreateForContest({ contestId, authorId, isTopSlate }: Slate): Observable<Slate> {
    return this.http.post<Slate>(this.contestAPIUrl, { contestId, authorId, isTopSlate }).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  contestCreateWithSlate(contestPrep: Partial<Pitch>): Observable<{ newPitch: Pitch; newSlate: Slate }> {
    return this.http.post<Pitch>(this.contestAPIUrl, contestPrep).pipe(
      exhaustMap((newPitch: Pitch) => {
        const slatePrep: Partial<Slate> = {
          id: 0, // Assuming backend assigns the ID
          contestId: newPitch.id,
          authorId: contestPrep.authorId!,
          isTopSlate: true,
        };
        if (environment.ianConfig.showLogs) console.log(newPitch);
        return this.http.post<Slate>(this.slateAPIUrl, {slatePrep.contestId}).pipe(
          map(newSlate => {
            if (environment.ianConfig.showLogs) console.log(newSlate);
            return { newPitch, newSlate: newSlate };
          })
        );
      }),
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  contestUpdateName(contestId: number, contest: Pitch): Observable<Pitch> {
    const endPoint = `${this.contestAPIUrl}/${contestId}`;
    return this.http.put<Pitch>(endPoint, contest).pipe(
      tap(data => {
        if (environment.ianConfig.showLogs) console.log('data', data);
      }),
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('ContestUpdateName failed'));
      })
    );
  }
}

// placementCreate({ authorId, assetId, folioId, caption }: Placement): Promise<Placement> {
//   //ContestsCreate(contest: Contest): Promise<Contest> {
//   if (environment.ianConfig.showLogs) console.log('input', caption);
//   if (environment.ianConfig.showLogs) console.log(this.contestAPIUrl);
//   return new Promise((resolve, reject) => {
//     this.http.post<Placement>(this.contestAPIUrl, { authorId, assetId, folioId, caption }).subscribe({
//       //this.http.post<Contest>(this.contestAPIUrl, contest).subscribe({
//       next: data => {
//         if (environment.ianConfig.showLogs) console.log('data', data);
//         resolve(data);
//       },
//       error: error => {
//         if (environment.ianConfig.showLogs) console.log('error', error);
//         reject(error);
//       },
//     });
//   });
// }

// getAllContestViews(): Promise<ContestView[]> {
//   return new Promise((resolve, reject) => {
//     //    setTimeout(() => {
//     this.http.get<ContestView[]>(this.contestViewAPIUrl).subscribe({
//       next: data => {
//         resolve(data);
//       },
//       error: error => {
//         if (environment.ianConfig.showLogs)  console.log('error', error);
//         reject(error);
//       },
//     });
//   });
// }

// ContestGet(): Promise<Contest[]> {
//   if (environment.ianConfig.showLogs)  console.log(`ballotsService.ContestGet() ${this.contestAPIUrl}`);
//   return new Promise((resolve, reject) => {
//     if (environment.ianConfig.showLogs)  console.log(`ballotsService.ContestGet() START PROMISE ${this.contestAPIUrl}`);
//     setTimeout(() => {
//       this.http.get<Contest[]>(this.contestAPIUrl).subscribe({
//         next: data => {
//           if (environment.ianConfig.showLogs)  console.log(`ballotsService.ContestGet() Resolved`);
//           resolve(data);
//         },
//         error: error => {
//           if (environment.ianConfig.showLogs)  console.log('error', error);
//           reject(error);
//         },
//       });
//     }, 500);
//   });
// }

// ContestCreateOld({ closes, opens, contestTitle, contestDescription, authorId, topSlateId }: Contest): Promise<Contest> {
//   if (environment.ianConfig.showLogs) console.log('input', contestTitle);
//   if (environment.ianConfig.showLogs) console.log(this.contestAPIUrl);
//   return new Promise((resolve, reject) => {
//     this.http.post<Contest>(this.contestAPIUrl, { closes, opens, contestTitle, contestDescription, authorId, topSlateId }).subscribe({
//       next: data => {
//         if (environment.ianConfig.showLogs) console.log('data', data);
//         resolve(data);
//       },
//       error: error => {
//         if (environment.ianConfig.showLogs) console.log('error', error);
//         reject(error);
//       },
//     });
//   });
// }
