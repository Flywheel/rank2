import { Component, effect, inject, input, untracked } from '@angular/core';
import { HomePitchComponent } from '../../home/home-pitch/home-pitch.component';
import { PitchStore } from '../pitch.store';

@Component({
  selector: 'mh5-pitch-chooser',
  standalone: true,
  imports: [HomePitchComponent],
  templateUrl: './pitch-chooser.component.html',
  styleUrl: './pitch-chooser.component.scss',
})
export class PitchShellComponent {
  pitchStore = inject(PitchStore);
  id = input<string>();

  loader = effect(() => {
    const pitchId = parseInt(this.id() ?? '0');
    untracked(() => {
      this.pitchStore.setPitchSelected(pitchId);
    });
  });
}
