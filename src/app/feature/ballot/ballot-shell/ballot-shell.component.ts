import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../body/body.component';

import { ContestStore } from '../../contest/contest.store';
import { ContestNewComponent } from '../../contest/contest-new/contest-new.component';
import { ContestScrollHorizontalComponent } from '../../contest/contest-scroll-horizontal/contest-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../../folio/folio-placement-new/folio-placement-new.component';

import { DirectComponent } from '../../contest/direct/direct.component';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    BodyComponent,
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
  theContests = this.ballotStore.pitches;
}
