import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { BallotBodyComponent } from '../ballot-body/ballot-body.component';
import { BallotMenuComponent } from '../ballot-menu/ballot-menu.component';
import { slateMemberViewInit } from '../../../core/models/initValues';
import { ViewerComponent } from '../../../core/components/viewer/viewer.component';
import { SlateMemberView } from '../../../core/models/interfaces';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [HeaderComponent, BallotBodyComponent, ViewerComponent, BallotMenuComponent],
  templateUrl: './ballot-shell.component.html',
  styleUrl: './ballot-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotShellComponent {
  hideViewerDisplay = signal<boolean>(true);
  slateMember = signal<SlateMemberView>(slateMemberViewInit);

  hidePlacementDisplayToggle(toggle: boolean) {
    this.hideViewerDisplay.set(toggle);
  }
  setSlateMemberView(slateMemberView: SlateMemberView) {
    this.slateMember.set(slateMemberView);
  }
}
