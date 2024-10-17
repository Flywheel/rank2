import { Injectable } from '@angular/core';

import {
  contestList,
  contestViewList,
  folioList,
  folioViewList,
  assetList,
  assetViewList,
  placementList,
  placementViewList,
  slateList,
  slateMemberList,
} from './mockdata4';
import {
  Asset,
  AssetView,
  Pitch,
  ContestView,
  Folio,
  FolioView,
  Placement,
  PlacementView,
  SlateMember,
  Slate,
} from '../app/core/models/interfaces';
@Injectable({
  providedIn: 'root',
})
export class MockdataService {
  public contestList: Pitch[] = contestList;
  public contestViewList: ContestView[] = contestViewList;
  public slateList: Slate[] = slateList;
  public slateMemberList: SlateMember[] = slateMemberList;
  public folioList: Folio[] = folioList;
  public folioViewList: FolioView[] = folioViewList;
  public placementList: Placement[] = placementList;
  public placementViewList: PlacementView[] = placementViewList;
  public assetList: Asset[] = assetList;
  public assetViewList: AssetView[] = assetViewList;
}
