import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BodyComponent } from '../body/body.component';
import { ViewerComponent } from '../viewer/viewer.component';
import { Contest } from '../../../core/interfaces/interfaces';
import { BallotStore } from '../ballot.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncSubject } from 'rxjs';
@Component({
  selector: 'mh5-container',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, ViewerComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent implements OnInit {
  ballotStore = inject(BallotStore);
  showViewer = false;
  theContests = this.ballotStore.allContests;
  theContestViews = this.ballotStore.allContestViews;
  theSelectedContest = computed(() => this.ballotStore.currentContestView());
  isReady$ = toObservable(this.ballotStore.isStartupLoadingComplete);
  emptyContest: Contest = {
    id: 1,
    authorId: 1,
    contestTitle: '-',
    contestDescription: '-',
    topSlateId: 0,
    opens: new Date('2024-01-01'),
    closes: new Date('2024-11-01'),
  };

  ngOnInit(): void {
    this.isReady$.subscribe(completed => {
      if (completed) {
        this.loadContestById(1);
      }
    });
  }

  async loadContestById(contestId: number) {
    console.log('loadContestById', contestId);
    await this.ballotStore.setCurrentContestByContestId(contestId);

    console.log(this.theSelectedContest());
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
