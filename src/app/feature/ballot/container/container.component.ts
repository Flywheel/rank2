import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { BodyComponent } from '../body/body.component';
import { ViewerComponent } from '../viewer/viewer.component';
import { BallotStore } from '../ballot.store';
import { NewContestComponent } from '../../contest/new-contest/new-contest.component';
import { ScrollContestHorizontalComponent } from '../../contest/scroll-contest-horizontal/scroll-contest-horizontal.component';
import { FolioPlacementNewComponent } from '../../folio/folio-placement-new/folio-placement-new.component';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-container',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, ViewerComponent, NewContestComponent, ScrollContestHorizontalComponent, FolioPlacementNewComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  ballotStore = inject(BallotStore);
  showViewer = false;
  theContests = this.ballotStore.allContests;
  newContest = signal(false);
  newPlacement = signal(false);

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
    if (environment.ianConfig.hideLogs) {
      console.log('Logging is disabled');
    } else {
      console.log('Environment:', environment);
      console.log(this.ballotStore.allContests());
      console.log(this.ballotStore.allContestViews());
      console.log(this.ballotStore.allContestSlates());
    }
  }
}
