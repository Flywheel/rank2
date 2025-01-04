import { Component, effect, inject, input, untracked } from '@angular/core';
import { PitchStore } from '@feature/pitch/pitch.store';
import { BallotShellComponent } from '../ballot-shell/ballot-shell.component';

@Component({
  selector: 'mh5-ballot-chooser',
  standalone: true,
  imports: [BallotShellComponent],
  templateUrl: './ballot-chooser.component.html',
  styleUrl: './ballot-chooser.component.scss',
})
export class BallotChooserComponent {
  pitchStore = inject(PitchStore);
  id = input<string>();

  loader = effect(() => {
    const pitchId = parseInt(this.id() ?? '0');
    untracked(() => {
      this.pitchStore.setPitchSelected(pitchId);
    });
  });
}
