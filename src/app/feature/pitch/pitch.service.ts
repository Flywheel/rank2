import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pitch, Slate, SlateMember } from '../../core/models/interfaces';
import { catchError, exhaustMap, forkJoin, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PitchService {
  http = inject(HttpClient);

  private pitchAPIUrl = `api/pitch`;
  private pitchViewAPIUrl = `api/pitchview`;

  private slateAPIUrl = `api/slate`;
  private slateViewAPIUrl = `api/slateview`;

  private slateMemberAPIUrl = `api/slatemember`;

  pitchCreate(pitchPrep: Partial<Pitch>): Observable<{ newPitch: Pitch; newSlate: Slate }> {
    // if (environment.ianConfig.showLogs) console.log(pitchPrep);
    return this.http.post<Pitch>(this.pitchAPIUrl, pitchPrep).pipe(
      exhaustMap((newPitch: Pitch) => {
        const slatePrep: Partial<Slate> = {
          pitchId: newPitch.id,
          authorId: pitchPrep.authorId!,
          isTopSlate: true,
        };
        // if (environment.ianConfig.showLogs) console.log(newPitch);
        return this.http.post<Slate>(this.slateAPIUrl, slatePrep).pipe(
          map(newSlate => {
            // if (environment.ianConfig.showLogs) console.log(newSlate);
            return { newPitch, newSlate };
          })
        );
      }),
      catchError(error => {
        if (environment.ianConfig.showLogs) console.log('error', error);
        return throwError(() => new Error('Pitch Create failed'));
      })
    );
  }

  pitchTitleUpdat(pitchId: number, pitch: Pitch): Observable<Pitch> {
    const endPoint = `${this.pitchAPIUrl}/${pitchId}`;
    return this.http.put<Pitch>(endPoint, pitch).pipe(
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
}
