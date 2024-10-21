import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pitch, PitchView, Slate, SlateMember, SlateView } from '../../core/models/interfaces';
import { catchError, exhaustMap, forkJoin, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContestService {
  http = inject(HttpClient);

  private contestAPIUrl = `api/contest`;
  private contestViewAPIUrl = `api/contestview`;

  private slateAPIUrl = `api/slate`;
  private slateViewAPIUrl = `api/slateview`;

  private slateMemberAPIUrl = `api/slatemember`;

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

  pitchCreate(contestPrep: Partial<Pitch>): Observable<{ newPitch: Pitch; newSlate: Slate }> {
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
            return { newPitch, newSlate };
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
    if (environment.ianConfig.showLogs) console.log(`slateGetAll ${this.slateAPIUrl}`);
    return this.http.get<Slate[]>(this.slateAPIUrl);
  }

  slateGetById(id: number): Observable<Slate> {
    return this.http.get<Slate>(`${this.slateAPIUrl}/${id}`);
  }

  //   slateViewsGetAll(): Observable<SlateView[]> {
  //     if (environment.ianConfig.showLogs) console.log(`  slateViewsGetAll(): Observable<SlateView[]> {
  //  ${this.slateViewAPIUrl}`);
  //     return this.http.get<SlateView[]>(this.slateViewAPIUrl);
  //   }

  // slateViewGetById(id: number): Observable<SlateView> {
  //   return this.http.get<SlateView>(`${this.slateViewAPIUrl}/${id}`);
  // }

  // slateCreate(slatePrep: Partial<Slate>): Observable<Slate> {
  //   return this.http.post<Slate>(this.slateAPIUrl, slatePrep).pipe(
  //     catchError(error => {
  //       if (environment.ianConfig.showLogs) console.log('error', error);
  //       return throwError(() => new Error('FolioCreate failed'));
  //     })
  //   );
  // }

  // slateCreateForContest(slatePrep: Partial<Slate>): Observable<Slate> {
  //   return this.http.post<Slate>(this.slateAPIUrl, slatePrep).pipe(
  //     catchError(error => {
  //       if (environment.ianConfig.showLogs) console.log('error', error);
  //       return throwError(() => new Error('FolioCreate failed'));
  //     })
  //   );
  // }

  addSlateMember(slateMember: SlateMember): Observable<SlateMember> {
    return this.http.post<SlateMember>(this.slateMemberAPIUrl, {
      placementId: slateMember.placementId,
      slateId: slateMember.slateId,
      rankOrder: slateMember.rankOrder,
    });
  }

  addSlateMembers(slateMembers: SlateMember[]): Observable<SlateMember[]> {
    const requests = slateMembers.map(slateMember =>
      this.http.post<SlateMember>(this.slateMemberAPIUrl, {
        placementId: slateMember.placementId,
        slateId: slateMember.slateId,
        rankOrder: slateMember.rankOrder,
      })
    );

    // Use forkJoin to aggregate the observables and return them as a single array
    return forkJoin(requests);
  }
  addSlateMembers2(slateMembers: SlateMember[]) {
    slateMembers.forEach(slateMember => {
      this.http.post<SlateMember[]>(this.slateMemberAPIUrl, slateMember);
    });
  }

  updateSlateMembers(slateMembers: SlateMember[]): Observable<SlateMember[]> {
    return this.http.put<SlateMember[]>(this.slateMemberAPIUrl, slateMembers);
  }

  deleteSlateMembersBySlateId(slateId: number) {
    return this.http.delete(`${this.slateMemberAPIUrl}/${slateId}`);
  }

  // addSlateMembers(slateMembers: SlateMember[]): Observable<SlateMember[]> {

  //   const promises = slateMembers.map((slateMember) => {
  //     return
  //       this.http
  //         .post<SlateMember>(this.slateMemberAPIUrl, {
  //           placementId: slateMember.placementId,
  //           slateId: slateMember.slateId,
  //           rankOrder: slateMember.rankOrder,
  //         })
  //         .subscribe({
  //           next: (data) => {

  //             resolve(data);
  //           },
  //           error: (error) => {
  //             reject(error);
  //           },
  //         });
  //     });
  //   });
  // }
}
