import { Component, effect, inject, input, untracked } from '@angular/core';
import { HomePitchComponent } from '../../home/home-pitch/home-pitch.component';
import { PitchStore } from '../pitch.store';

@Component({
  selector: 'mh5-pitch-shell',
  standalone: true,
  imports: [HomePitchComponent],
  templateUrl: './pitch-shell.component.html',
  styleUrl: './pitch-shell.component.scss',
})
export class PitchShellComponent {
  pitchStore = inject(PitchStore);
  id = input<string>();

  loader = effect(() => {
    const x = parseInt(this.id() ?? '0');
    untracked(() => {
      this.pitchStore.setPitchSelected(x);
    });
  });
}
