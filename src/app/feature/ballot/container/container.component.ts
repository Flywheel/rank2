import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BodyComponent } from '../body/body.component';
import { ViewerComponent } from '../viewer/viewer.component';
import { Contest } from '../../../core/interfaces/interfaces';
import { BallotStore } from '../ballot.store';

@Component({
  selector: 'mh5-container',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, ViewerComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  ballotStore = inject(BallotStore);
  showViewer = false;
  theContests = this.ballotStore.allContests;
  theContestviews = this.ballotStore.allContestViews;

  emptyContest: Contest = {
    id: 1,
    authorId: 1,
    contestTitle: '-',
    contestDescription: '-',
    topSlateId: 0,
    opens: new Date('2024-01-01'),
    closes: new Date('2024-11-01'),
  };

  constructor() {
    this.showViewer = false;
  }

  addContest() {
    this.ballotStore.addContest(this.emptyContest);
  }
}
