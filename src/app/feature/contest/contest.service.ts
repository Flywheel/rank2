import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pitch, PitchView, Slate, SlateView } from '../../core/models/interfaces';
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

  //#region Contest
  contestsGetAll(): Observable<Pitch[]> {
    return this.http.get<Pitch[]>(this.contestAPIUrl);
  }

  contestGetById(id: number): Observable<Pitch> {
    return this.http.get<Pitch>(`${this.contestAPIUrl}/${id}`);
  }

  contestViewsGetAll(): Observable<PitchView[]> {
    if (environment.ianConfig.showLogs) console.log(`ballotsService.allContestViews() ${this.contestViewAPIUrl}`);
    return this.http.get<PitchView[]>(this.contestViewAPIUrl);
  }

  contestViewGetById(id: number): Observable<PitchView> {
    return this.http.get<PitchView>(`${this.contestViewAPIUrl}/${id}`);
  }

  contestCreateWithSlate(contestPrep: Partial<Pitch>): Observable<{ newPitch: Pitch; newSlate: Slate }> {
    return this.http.post<Pitch>(this.contestAPIUrl, contestPrep).pipe(
      exhaustMap((newPitch: Pitch) => {
        const slatePrep: Partial<Slate> = {
          pitchId: newPitch.id,
          authorId: contestPrep.authorId!,
          isTopSlate: true,
        };
        if (environment.ianConfig.showLogs) console.log(newPitch);
        return this.http.post<Slate>(this.slateAPIUrl, slatePrep).pipe(
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

  //#endregion Contest

  //#region Slate

  slateGetAll(): Observable<Slate[]> {
    if (environment.ianConfig.showLogs) console.log(`ballotsService.allContests() ${this.slateAPIUrl}`);
    return this.http.get<Slate[]>(this.slateAPIUrl);
  }

  slateGetById(id: number): Observable<Slate> {
    return this.http.get<Slate>(`${this.slateAPIUrl}/${id}`);
  }

  slateViewsGetAll(): Observable<SlateView[]> {
    if (environment.ianConfig.showLogs) console.log(`ballotsService.allContestViews() ${this.slateViewAPIUrl}`);
    return this.http.get<SlateView[]>(this.slateViewAPIUrl);
  }

  slateViewGetById(id: number): Observable<SlateView> {
    return this.http.get<SlateView>(`${this.slateViewAPIUrl}/${id}`);
  }

  slateCreate(slatePrep: Partial<Slate>): Observable<Slate> {
    return this.http.post<Slate>(this.slateAPIUrl, slatePrep).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }

  slateCreateForContest(slatePrep: Partial<Slate>): Observable<Slate> {
    return this.http.post<Slate>(this.slateAPIUrl, slatePrep).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
      })
    );
  }
  slateCreateForContest2({ pitchId: contestId, authorId, isTopSlate }: Slate): Observable<Slate> {
    return this.http.post<Slate>(this.slateAPIUrl, { contestId, authorId, isTopSlate }).pipe(
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('FolioCreate failed'));
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

// ContestCreateOld({ closes, opens, title, description, authorId, topSlateId }: Contest): Promise<Contest> {
//   if (environment.ianConfig.showLogs) console.log('input', title);
//   if (environment.ianConfig.showLogs) console.log(this.contestAPIUrl);
//   return new Promise((resolve, reject) => {
//     this.http.post<Contest>(this.contestAPIUrl, { closes, opens, title, description, authorId, topSlateId }).subscribe({
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
// contestCreate({ closes, opens, folioId, title, description, authorId }: Pitch): Observable<Pitch> {
//   return this.http.post<Pitch>(this.contestAPIUrl, { closes, opens, folioId, title, description, authorId }).pipe(
//     catchError(error => {
//       if (environment.ianConfig.showLogs) console.log('error', error);
//       return throwError(() => new Error('FolioCreate failed'));
//     })
//   );
// }
