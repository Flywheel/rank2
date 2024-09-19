import { Injectable } from '@angular/core';

import { contestList, contestViewList, folioList, folioViewList } from './mockdata';
import { Contest, ContestView, Folio } from '../app/core/interfaces/interfaces';
@Injectable({
  providedIn: 'root',
})
export class MockdataService {
  public contestList: Contest[] = contestList;
  public contestViewList: ContestView[] = contestViewList;
  public folioList: Folio[] = folioList;
  public folioViewList: Folio[] = folioViewList;
}
