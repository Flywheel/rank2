import { Component, computed, output, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ViewerComponent } from '../../../core/components/viewer/viewer.component';
import { HomeMenuComponent } from '../home-menu/home-menu.component';
import { slateMemberViewInit } from '../../../core/models/initValues';
import { SlateMemberView } from '../../../core/models/interfaces';
import { FormsModule } from '@angular/forms';
import { HomePitchComponent } from '../home-pitch/home-pitch.component';
import { PitchShellComponent } from '../../pitch/pitch-shell/pitch-shell.component';
import { BackdoorComponent } from '../../../core/components/backdoor/backdoor.component';

@Component({
  selector: 'mh5-home-shell',
  standalone: true,
  imports: [HeaderComponent, ViewerComponent, HomeMenuComponent, FormsModule, HomePitchComponent, PitchShellComponent, BackdoorComponent],
  templateUrl: './home-shell.component.html',
  styleUrl: './home-shell.component.scss',
})
export class HomeShellComponent {
  hidBackdoor = signal<boolean>(true);
  hidePlacementViewer = signal<boolean>(true);
  slateMember = signal<SlateMemberView>(slateMemberViewInit);
  navigationId = computed<number>(() => this.slateMember().id);
  resetPitch = output<void>();

  togglePlacementViewer(toggle: boolean) {
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
