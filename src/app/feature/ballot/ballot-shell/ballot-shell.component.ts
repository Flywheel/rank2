import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { BodyComponent } from '../body/body.component';

import { PitchScrollerComponent } from '../../pitch/pitch-scroller/pitch-scroller.component';

import { DirectComponent } from '../../pitch/direct/direct.component';
import { slateMemberViewInit } from '../../../core/models/initValues';
import { ViewerComponent } from '../../../core/viewer/viewer/viewer.component';
import { SlateMemberView } from '../../../core/models/interfaces';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, PitchScrollerComponent, DirectComponent, ViewerComponent],
  templateUrl: './ballot-shell.component.html',
  styleUrl: './ballot-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotShellComponent {
  hideViewerDisplay = signal<boolean>(true);
  slateMember = signal<SlateMemberView>(slateMemberViewInit);

  hidePlacementDisplayToggle() {
    this.hideViewerDisplay.set(!this.hideViewerDisplay());
  }
  setSlateMemberView(slateMemberView: SlateMemberView) {
    this.slateMember.set(slateMemberView);
  }
}
