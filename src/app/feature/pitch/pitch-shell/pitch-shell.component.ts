import { Component, computed, output, signal } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { ViewerComponent } from '@shared/components/viewer/viewer.component';
import { PitchMenuComponent } from '@feature/pitch/pitch-menu/pitch-menu.component';
import { slateMemberViewInit } from '@shared/models/initValues';
import { SlateMemberView } from '@shared/models/interfaces';
import { FormsModule } from '@angular/forms';
import { PitchSlateComponent } from '@feature/pitch/pitch-slate/pitch-slate.component';
import { PitchChooserComponent } from '@feature/pitch/pitch-chooser/pitch-chooser.component';
import { BackdoorComponent } from '@shared/components/backdoor/backdoor.component';
import { SwipeRightDirective } from '@shared/directives/swipe-right.directive';

@Component({
  selector: 'mh5-pitch-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    ViewerComponent,
    PitchMenuComponent,
    FormsModule,
    PitchSlateComponent,
    PitchChooserComponent,
    BackdoorComponent,
    SwipeRightDirective,
  ],
  templateUrl: './pitch-shell.component.html',
  styleUrl: './pitch-shell.component.scss',
})
export class PitchShellComponent {
  hideBackdoor = signal<boolean>(true);
  hidePlacementViewer = signal<boolean>(true);
  slateMember = signal<SlateMemberView>(slateMemberViewInit);
  navigationId = computed<number>(() => this.slateMember().id);
  resetPitch = output<void>();
  togglePlacementViewer(toggle: boolean) {
    console.log(toggle);
    this.hidePlacementViewer.set(toggle);
    if (toggle) {
      this.resetPitch.emit();
    }
  }

  setSlateMemberView(slateMemberView: SlateMemberView) {
    this.slateMember.set(slateMemberView);
  }

  setPitchView(slateMemberView: SlateMemberView) {
    this.slateMember.set(slateMemberView);
    this.resetPitch.emit();
  }
}
