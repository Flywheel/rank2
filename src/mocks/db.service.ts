import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Asset, Contest, ContestView, Folio, FolioView, Placement, PlacementView } from '../app/core/interfaces/interfaces';
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
    const placement: Placement[] = this.mockData.placementList;
    const placementview: PlacementView[] = this.mockData.placementViewList;
    const asset: Asset[] = this.mockData.assetList;
    return { contest, contestview, folio, folioview, placement, placementview, asset };
  }
}
