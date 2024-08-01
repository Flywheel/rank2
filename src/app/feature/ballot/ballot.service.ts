import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Contest } from '../../core/models/models';
@Injectable({
  providedIn: 'root',
})
export class BallotService {
  http = inject(HttpClient);

  private contestAPIUrl = `${environment.HOST_DOMAIN}/api/contest`;

  ContestsGet(): Promise<Contest[]> {
    console.log(this.contestAPIUrl);
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

  ContestsCreate({ closes, opens, contestTitle, contestDescription, authorId, topSlateId }: Contest): Promise<Contest> {
    //ContestsCreate(contest: Contest): Promise<Contest> {
    console.log('input', contestTitle);
    console.log(this.contestAPIUrl);
    return new Promise((resolve, reject) => {
      this.http
        .post<Contest>(this.contestAPIUrl, { closes, opens, contestTitle, contestDescription, authorId, topSlateId })
        .subscribe({
          //this.http.post<Contest>(this.contestAPIUrl, contest).subscribe({
          next: data => {
            console.log('data', data);
            resolve(data);
          },
          error: error => {
            console.log('error', error);
            reject(error);
          },
        });
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
