import { Component, computed, effect, inject, input } from '@angular/core';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { HomePitchComponent } from '../../home/home-pitch/home-pitch.component';
import { PitchStore } from '../pitch.store';

@Component({
  selector: 'mh5-pitch-shell',
  standalone: true,
  imports: [HeaderComponent, HomePitchComponent],
  templateUrl: './pitch-shell.component.html',
  styleUrl: './pitch-shell.component.scss',
})
export class PitchShellComponent {
  pitchStore = inject(PitchStore);
  id = input<string>();

  // constructor() {
  //   this.pitchStore.setPitchSelected(parseInt(this.id() ?? '0'));
  // }

  thePitchView = computed(() => this.pitchStore.pitchViewsComputed().find(p => p.id === parseInt(this.id() ?? '0')));
}
