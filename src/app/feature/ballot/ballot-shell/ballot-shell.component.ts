import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../body/body.component';

import { PitchStore } from '../../contest/pitch.store';
import { PitchScrollerComponent } from '../../contest/pitch-scroller-horizontal/pitch-scroller.component';

import { DirectComponent } from '../../contest/direct/direct.component';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, PitchScrollerComponent, DirectComponent],
  templateUrl: './ballot-shell.component.html',
  styleUrl: './ballot-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotShellComponent {
  ballotStore = inject(PitchStore);
  theContests = this.ballotStore.pitches;
}
