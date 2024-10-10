import { Injectable } from '@angular/core';

import { contestList, contestViewList, folioList, folioViewList, assetList, assetViewList, placementList, placementViewList } from './mockdata4';
import { Asset, AssetView, Contest, ContestView, Folio, FolioView, Placement, PlacementView } from '../app/core/models/interfaces';
@Injectable({
  providedIn: 'root',
})
export class MockdataService {
  public contestList: Contest[] = contestList;
  public contestViewList: ContestView[] = contestViewList;
  public folioList: Folio[] = folioList;
  public folioViewList: FolioView[] = folioViewList;
  public placementList: Placement[] = placementList;
  public placementViewList: PlacementView[] = placementViewList;
  public assetList: Asset[] = assetList;
  public assetViewList: AssetView[] = assetViewList;
}
