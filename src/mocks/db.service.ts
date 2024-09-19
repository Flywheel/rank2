import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Contest, ContestView, Folio, FolioView } from '../app/core/interfaces/interfaces';
import { MockdataService } from './mockdata.service';

@Injectable({
  providedIn: 'root',
})
export class DbService implements InMemoryDbService {
  mockData = new MockdataService();
  createDb() {
    const contestview: ContestView[] = this.mockData.contestViewList;
    const contest: Contest[] = this.mockData.contestList;
    const folio: Folio[] = this.mockData.folioList;
    const folioview: FolioView[] = this.mockData.folioViewList;
    return { contest, contestview, folio, folioview };
  }
}
