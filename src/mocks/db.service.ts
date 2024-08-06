import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Contest, ContestView } from '../app/core/interfaces/interfaces';
import { MockdataService } from './mockdata.service';

@Injectable({
  providedIn: 'root',
})
export class DbService implements InMemoryDbService {
  mockData = new MockdataService();

  createDb() {
    const contestview: ContestView[] = this.mockData.contestViewList;
    const contest: Contest[] = this.mockData.contestList;
    console.log(`++++++++++++++++++++InMemoryDbService++++++++++++++++++++++++ ${contestview.length} ${contestview[0].contestTitle}`);
    console.log(contestview);
    return { contest, contestview };
  }
}
