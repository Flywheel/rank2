import { Injectable } from '@angular/core';

import { contestList, contestViewList } from './mockdata';
import { Contest, ContestView } from '../app/core/interfaces/interfaces';
@Injectable({
  providedIn: 'root',
})
export class MockdataService {
  public contestList: Contest[] = contestList;
  public contestViewList: ContestView[] = contestViewList;
}
