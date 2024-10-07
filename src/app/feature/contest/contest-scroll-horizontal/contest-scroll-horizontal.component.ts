import { Component, inject, input, output } from '@angular/core';
import { Contest } from '../../../core/interfaces/interfaces';
import { ContestStore } from '../../ballot/contest.store';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-contest-scroll-horizontal',
  standalone: true,
  imports: [],
  templateUrl: './contest-scroll-horizontal.component.html',
  styleUrl: './contest-scroll-horizontal.component.scss',
})
export class ContestScrollHorizontalComponent {
  ballotStore = inject(ContestStore);
  theContestsInput = input<Contest[]>();
  newContestEditorStateChange = output<boolean>();
  newPlacementEditorStateChange = output<boolean>();

  selectContest(id: number) {
    this.ballotStore.setCurrentContestView(id);
    if (environment.ianConfig.showLogs) {
      console.log('selectContest', id);
      console.log('allContestViews', this.ballotStore.allContestViews());
      console.log('allContests', this.ballotStore.allContests());
      //  console.log('allContests', this.ballotStore.allFolioView());
    }
    // const theContest = this.ballotStore.allContestViews().filter(c => c.id === id);
    // if (theContest.length > 0) {
    //   console.log('ContestView = Found', id);
    //   //  this.ballotStore.setCurrentContestView(id);
    // } else {
    //   console.log('ContestView = Not Found', id);
    //   //     this.newPlacementEditorStateChange.emit(true);
    // }
  }
  newContest() {
    this.newContestEditorStateChange.emit(true);
  }
}
