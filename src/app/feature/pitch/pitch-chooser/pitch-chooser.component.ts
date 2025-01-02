import { Component, effect, inject, input, untracked } from '@angular/core';
import { PitchSlateComponent } from '@feature/pitch/pitch-slate/pitch-slate.component';
import { PitchStore } from '../pitch.store';

@Component({
  selector: 'mh5-pitch-chooser',
  standalone: true,
  imports: [PitchSlateComponent],
  templateUrl: './pitch-chooser.component.html',
  styleUrl: './pitch-chooser.component.scss',
})
export class PitchChooserComponent {
  pitchStore = inject(PitchStore);
  id = input<string>();

  loader = effect(() => {
    const pitchId = parseInt(this.id() ?? '0');
    untracked(() => {
      this.pitchStore.setPitchSelected(pitchId);
    });
  });
}
