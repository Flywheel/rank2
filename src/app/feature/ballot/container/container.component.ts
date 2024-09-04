import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
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
  theContestViews = this.ballotStore.allContestViews;
  theSelectedContest = computed(() => this.ballotStore.currentContestView());
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
    effect(() => {
      if (this.ballotStore.isStartupLoadingComplete()) {
        console.log('isStartupLoadingComplete');
        untracked(() => {
          this.ballotStore.rxContestViewById(1);
        });
      }
    });
  }

  addContest() {
    console.log(this.theSelectedContest());
    this.ballotStore.addContest(this.emptyContest);
  }
  selectContest() {
    console.log(this.theSelectedContest());
    this.ballotStore.addContest(this.emptyContest);
  }
}
