import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { BallotBodyComponent } from '../ballot-body/ballot-body.component';
import { BallotMenuComponent } from '../ballot-menu/ballot-menu.component';
import { slateMemberViewInit } from '@shared/models/initValues';
import { ViewerComponent } from '@shared/components/viewer/viewer.component';
import { SlateMemberView } from '@shared/models/interfaces';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [HeaderComponent, BallotBodyComponent, ViewerComponent, BallotMenuComponent],
  templateUrl: './ballot-shell.component.html',
  styleUrl: './ballot-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotShellComponent {
  hidePlacementViewer = signal<boolean>(true);
  slateMember = signal<SlateMemberView>(slateMemberViewInit);

  resetPitch = output<void>();

  togglePlacementViewer(toggle: boolean) {
    console.log('togglePlacementViewer', toggle);
    this.hidePlacementViewer.set(toggle);
    if (toggle) {
      this.resetPitch.emit();
    }
  }
  setSlateMemberView(slateMemberView: SlateMemberView) {
    console.log('setSlateMemberView', slateMemberView);
    this.slateMember.set(slateMemberView);
  }

  setPitchView(slateMemberView: SlateMemberView) {
    console.log('setSlateMemberView', slateMemberView);
    this.slateMember.set(slateMemberView);
    this.resetPitch.emit();
  }
}
