import { Component, inject, input } from '@angular/core';
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

  selectContest(data: Contest) {
    if (this.logger.enabled) console.log(data);
    this.ballotStore.setCurrentContestView(data.id);
  }
}
