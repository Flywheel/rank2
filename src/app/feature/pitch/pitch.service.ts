import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pitch, Slate, SlateMember } from '../../core/models/interfaces';
import { catchError, exhaustMap, forkJoin, map, Observable, retry, tap, throwError, timeout } from 'rxjs';
import { ErrorService } from '../../core/services/error.service';

@Injectable({
  providedIn: 'root',
})
export class PitchService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);
  err = this.errorService.handleHttpErrorResponse;

  private pitchAPIUrl = `api/pitch`;
  private slateAPIUrl = `api/slate`;
  private slateMemberAPIUrl = `api/slatemember`;

  createPitchWithSlate(pitchPrep: Partial<Pitch>): Observable<{ newPitch: Pitch; newSlate: Slate }> {
    return this.http.post<Pitch>(this.pitchAPIUrl, pitchPrep).pipe(
      timeout(2500),
      retry(2),
      exhaustMap((newPitch: Pitch) => {
        const slatePrep: Partial<Slate> = {
          pitchId: newPitch.id,
          authorId: pitchPrep.authorId!,
          isTopSlate: true,
        };
        return this.http.post<Slate>(this.slateAPIUrl, slatePrep).pipe(
          map(newSlate => {
            return { newPitch, newSlate };
          })
        );
      }),
      catchError(error => this.err(error, 'Pitch creation failed'))
    );
  }

  pitchTitleUpdate(pitchId: number, pitch: Pitch): Observable<Pitch> {
    const endPoint = `${this.pitchAPIUrl}/${pitchId}`;
    return this.http.put<Pitch>(endPoint, pitch).pipe(
      timeout(2500),
      retry(2),
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

  updateSlateMembers(slateMembers: SlateMember[]): Observable<SlateMember[]> {
    return this.http.put<SlateMember[]>(this.slateMemberAPIUrl, slateMembers);
  }

  deleteSlateMembersBySlateId(slateId: number) {
    return this.http.delete(`${this.slateMemberAPIUrl}/${slateId}`);
  }
}

// addSlateMembers2(slateMembers: SlateMember[]) {
//   slateMembers.forEach(slateMember => {
//     this.http.post<SlateMember[]>(this.slateMemberAPIUrl, slateMember);
//   });
// }

// pitchCreateWithPlacement(pitchPrep: Partial<Pitch>): Observable<{ newPitch: Pitch; newSlate: Slate }> {
//   return this.http.post<Pitch>(this.pitchAPIUrl, pitchPrep).pipe(
//     timeout(2500),
//     retry(2),
//     exhaustMap((newPitch: Pitch) => {
//       const slatePrep: Partial<Slate> = {
//         pitchId: newPitch.id,
//         authorId: pitchPrep.authorId!,
//         isTopSlate: true,
//       };
//       return this.http.post<Slate>(this.slateAPIUrl, slatePrep).pipe(
//         map(newSlate => {
//           return { newPitch, newSlate };
//         })
//       );
//     }),
//     catchError(error => this.err(error, 'Pitch with Slate creation failed'))
//   );
// }
