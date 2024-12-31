import { Component, computed, output, signal } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { ViewerComponent } from '@shared/components/viewer/viewer.component';
import { HomeMenuComponent } from '../home-menu/home-menu.component';
import { slateMemberViewInit } from '@shared/models/initValues';
import { SlateMemberView } from '@shared/models/interfaces';
import { FormsModule } from '@angular/forms';
import { HomePitchComponent } from '../home-pitch/home-pitch.component';
import { PitchShellComponent } from '../../pitch/pitch-chooser/pitch-chooser.component';
import { BackdoorComponent } from '@shared/components/backdoor/backdoor.component';
import { SwipeLeftDirective } from '@shared/directives/swipe-left.directive';

@Component({
  selector: 'mh5-home-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    ViewerComponent,
    HomeMenuComponent,
    FormsModule,
    HomePitchComponent,
    PitchShellComponent,
    BackdoorComponent,
    SwipeLeftDirective,
  ],
  templateUrl: './home-shell.component.html',
  styleUrl: './home-shell.component.scss',
})
export class HomeShellComponent {
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
