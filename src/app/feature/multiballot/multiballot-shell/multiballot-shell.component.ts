import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { BallotBodyComponent } from '@feature/ballot/ballot-body/ballot-body.component';
import { MultiballotMenuComponent } from '../multiballot-menu/multiballot-menu.component';
import { slateMemberViewInit } from '@shared/models/initValues';
import { ViewerComponent } from '@shared/components/viewer/viewer.component';
import { SlateMemberView } from '@shared/models/interfaces';
import { FooterComponent } from '@shared/components/footer/footer.component';

@Component({
  selector: 'mh5-multiballot-shell',
  standalone: true,
  imports: [HeaderComponent, BallotBodyComponent, ViewerComponent, MultiballotMenuComponent, FooterComponent],
  templateUrl: './multiballot-shell.component.html',
  styleUrl: './multiballot-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiballotShellComponent {
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
