import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BodyComponent } from '../body/body.component';
import { ViewerComponent } from '../viewer/viewer.component';
import { Contest } from '../../../core/interfaces/interfaces';
import { BallotStore, contestInit } from '../ballot.store';
import { LogService } from '../../../core/log/log.service';
import { NewContestComponent } from '../../contest/new-contest/new-contest.component';
import { ScrollContestHorizontalComponent } from '../../contest/scroll-contest-horizontal/scroll-contest-horizontal.component';
@Component({
  selector: 'mh5-container',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, ViewerComponent, NewContestComponent, ScrollContestHorizontalComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  ballotStore = inject(BallotStore);
  logger = inject(LogService);
  showViewer = false;
  theContests = this.ballotStore.allContests;
  // theContestViews = this.ballotStore.allContestViews;
  theSelectedContest = computed(() => this.ballotStore.currentContestView());
  emptyContest: Contest = contestInit;
}
