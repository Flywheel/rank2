import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Contest, ContestView, Placement } from '../../core/interfaces/interfaces';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BallotService {
  http = inject(HttpClient);

  private contestAPIUrl = `${environment.HOST_DOMAIN}/api/contest`;
  private contestViewAPIUrl = `${environment.HOST_DOMAIN}/api/contestview`;

  ContestGet(): Promise<Contest[]> {
    console.log(`ballotsService.ContestGet() ${this.contestAPIUrl}`);
    return new Promise((resolve, reject) => {
      console.log(`ballotsService.ContestGet() START PROMISE ${this.contestAPIUrl}`);
      setTimeout(() => {
        this.http.get<Contest[]>(this.contestAPIUrl).subscribe({
          next: data => {
            console.log(`ballotsService.ContestGet() Resolved`);
            resolve(data);
          },
          error: error => {
            console.log('error', error);
            reject(error);
          },
        });
      }, 500);
    });
  }

  ContestCreate({ closes, opens, contestTitle, contestDescription, authorId, topSlateId }: Contest): Promise<Contest> {
    //ContestsCreate(contest: Contest): Promise<Contest> {
    console.log('input', contestTitle);
    console.log(this.contestAPIUrl);
    return new Promise((resolve, reject) => {
      this.http.post<Contest>(this.contestAPIUrl, { closes, opens, contestTitle, contestDescription, authorId, topSlateId }).subscribe({
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
  PlacementCreate({ authorId, assetId, folioId, caption }: Placement): Promise<Placement> {
    //ContestsCreate(contest: Contest): Promise<Contest> {
    console.log('input', caption);
    console.log(this.contestAPIUrl);
    return new Promise((resolve, reject) => {
      this.http.post<Placement>(this.contestAPIUrl, { authorId, assetId, folioId, caption }).subscribe({
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
  //     //    setTimeout(() => {
  //     this.http.get<ContestView[]>(this.contestViewAPIUrl).subscribe({
  //       next: data => {
  //         resolve(data);
  //       },
  //       error: error => {
  //         console.log('error', error);
  //         reject(error);
  //       },
  //     });
  //   });
  // }

  allContests(): Observable<Contest[]> {
    console.log(`ballotsService.allContests() ${this.contestAPIUrl}`);
    return this.http.get<Contest[]>(this.contestAPIUrl);
  }
  allContestViews(): Observable<ContestView[]> {
    console.log(`ballotsService.allContestViews() ${this.contestViewAPIUrl}`);
    return this.http.get<ContestView[]>(this.contestViewAPIUrl);
  }
}
