import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ViewerComponent } from '../../../core/components/viewer/viewer.component';
import { HomeMenuComponent } from '../home-menu/home-menu.component';
import { slateMemberViewInit } from '../../../core/models/initValues';
import { SlateMemberView } from '../../../core/models/interfaces';
import { FormsModule } from '@angular/forms';
import { HomePitchComponent } from '../home-pitch/home-pitch.component';

@Component({
  selector: 'mh5-home-shell',
  standalone: true,
  imports: [HeaderComponent, ViewerComponent, HomeMenuComponent, FormsModule, HomePitchComponent],
  templateUrl: './home-shell.component.html',
  styleUrl: './home-shell.component.scss',
})
export class HomeShellComponent {
  hideViewerDisplay = signal<boolean>(true);
  slateMember = signal<SlateMemberView>(slateMemberViewInit);

  hidePlacementDisplayToggle(toggle: boolean) {
    this.hideViewerDisplay.set(toggle);
  }
  setSlateMemberView(slateMemberView: SlateMemberView) {
    this.slateMember.set(slateMemberView);
  }
}
