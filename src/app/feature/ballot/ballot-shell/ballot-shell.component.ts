import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../body/body.component';

import { PitchScrollerComponent } from '../../pitch/pitch-scroller/pitch-scroller.component';

import { DirectComponent } from '../../pitch/direct/direct.component';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, PitchScrollerComponent, DirectComponent],
  templateUrl: './ballot-shell.component.html',
  styleUrl: './ballot-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotShellComponent {}
