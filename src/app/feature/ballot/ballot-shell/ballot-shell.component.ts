import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../body/body.component';
import { ViewerComponent } from '../viewer/viewer.component';
import { ContestStore } from '../../contest/contest.store';
import { ContestNewComponent } from '../../contest/contest-new/contest-new.component';
import { ContestScrollHorizontalComponent } from '../../contest/contest-scroll-horizontal/contest-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../../folio/folio-placement-new/folio-placement-new.component';

import { environment } from '../../../../environments/environment';
import { DirectComponent } from '../../contest/direct/direct.component';
import { FolioStore } from '../../folio/folio.store';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    BodyComponent,
    ViewerComponent,
    ContestNewComponent,
    ContestScrollHorizontalComponent,
    FolioPlacementNewComponent,
    DirectComponent,
  ],
  templateUrl: './ballot-shell.component.html',
  styleUrl: './ballot-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotShellComponent {
  ballotStore = inject(ContestStore);
  folioStore = inject(FolioStore);
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
      console.log('Asset-Placement-Folio');
      console.log(this.folioStore.assetViewsComputed());
      console.log(this.folioStore.placementViewsComputed());
      console.log(this.folioStore.folioViewsComputed());

      console.log('SlateMember-Slate-Pitch-Contest');
      console.log(this.ballotStore.slateMembers());
      console.log(this.ballotStore.slates());
      console.log(this.ballotStore.pitches());
      console.log(this.ballotStore.allContests());

      console.log('SlateMember-Slate-Pitch : Computed Views');
      console.log(this.ballotStore.slateMemberViewsComputed());
      console.log(this.ballotStore.slateViewsComputed());
      console.log(this.ballotStore.pitchViewsComputed());

      console.log('ContestSlateViewsComputed : Contest Views');
      console.log(this.ballotStore.allContestSlateViewsComputed());
      console.log(this.ballotStore.allContestViews());
    }
  }
}
