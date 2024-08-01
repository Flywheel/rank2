import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BodyComponent } from '../body/body.component';
import { ViewerComponent } from '../viewer/viewer.component';
import { DbService } from '../../../core/db/db.service';
import { Contest } from '../../../core/models/models';
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
  dbService = inject(DbService);
  ballotStore = inject(BallotStore);
  showViewer = false;
  theContests = this.ballotStore.allContests;
  theData = signal<Contest[]>([]);
  // data$ = this.dbService.AllContests2();
  // contestData = computed(() => toSignal(this.dbService.AllContests2() ?? [{}]));

  testInsert: Contest = {
    id: 1,
    authorId: 1,
    contestTitle: '-',
    contestDescription: '-',
    topSlateId: 1,
    opens: new Date('2024-01-01'),
    closes: new Date('2024-11-01'),
  };

  constructor() {
    this.showViewer = false;
    //  this.theData.set(this.dbService.AllContests());
  }

  addContest() {
    //this.ballotStore.addContest(this.testInsert);
    // this.dbService.addContest(this.testInsert);
    // this.theData.set(this.dbService.getAllContests());
    // this.dbService.getContestAllContests2().subscribe(data => {
    //   console.log(data);
    // });
  }
}
