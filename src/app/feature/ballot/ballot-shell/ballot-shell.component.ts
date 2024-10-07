import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../body/body.component';
import { ViewerComponent } from '../viewer/viewer.component';
import { ContestStore } from '../contest.store';
import { ContestNewComponent } from '../../contest/contest-new/contest-new.component';
import { ContestScrollHorizontalComponent } from '../../contest/contest-scroll-horizontal/contest-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../../folio/folio-placement-new/folio-placement-new.component';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, ViewerComponent, ContestNewComponent, ContestScrollHorizontalComponent, FolioPlacementNewComponent],
  templateUrl: './ballot-shell.component.html',
  styleUrl: './ballot-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotShellComponent {
  ballotStore = inject(ContestStore);
  showViewer = false;
  theContests = this.ballotStore.allContests;
  newContest = signal(false);
  newPlacement = signal(false);
  headerOption = 'contest';

  openNewContest() {
    this.newContest.set(true);
  }
  closeNewContest() {
    this.newContest.set(false);
  }

  openNewPlacement() {
    this.newPlacement.set(true);
  }
  closeNewPlacement() {
    this.newPlacement.set(false);
  }
  runLog() {
    if (environment.ianConfig.showLogs) {
      console.log('Environment:', environment);
      console.log(this.ballotStore.allContests());
      console.log(this.ballotStore.allContestViews());
      console.log(this.ballotStore.allContestSlates());
    }
  }
}
