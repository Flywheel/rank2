import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Contest } from '../../core/models/models';

@Injectable({
  providedIn: 'root',
})
export class BallotService {
  http = inject(HttpClient);

  private contestAPIUrl = 'https://localhost:4200/api/contest';

  ContestsGet(): Promise<Contest[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.http.get<Contest[]>(this.contestAPIUrl).subscribe({
          next: data => {
            resolve(data);
          },
          error: error => {
            reject(error);
          },
        });
      }, 500);
    });
  }

  // getAllContestViews(): Promise<ContestView[]> {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       this.http.get<ContestView[]>(this.contestAPIUrl).subscribe({
  //         next: data => {
  //           resolve(data);
  //         },
  //         error: error => {
  //           reject(error);
  //         },
  //       });
  //     }, 500);
  //   });
  // }

  // getAllContests(): Observable<Contest[]> {
  //   return this.http.get<Contest[]>('api/contest');
  // }
}
