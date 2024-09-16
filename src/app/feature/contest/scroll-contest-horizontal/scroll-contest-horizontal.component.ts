import { Component, inject, input, output } from '@angular/core';
import { Contest } from '../../../core/interfaces/interfaces';
import { LogService } from '../../../core/log/log.service';
import { BallotStore } from '../../ballot/ballot.store';
@Component({
  selector: 'mh5-scroll-contest-horizontal',
  standalone: true,
  imports: [],
  templateUrl: './scroll-contest-horizontal.component.html',
  styleUrl: './scroll-contest-horizontal.component.scss',
})
export class ScrollContestHorizontalComponent {
  logger = inject(LogService);
  ballotStore = inject(BallotStore);
  theContestsInput = input<Contest[]>();
  newContestEditorStateChange = output<boolean>();

  selectContest(id: number) {
    this.ballotStore.setCurrentContestView(id);
  }
  newContest() {
    this.newContestEditorStateChange.emit(true);
  }
}
