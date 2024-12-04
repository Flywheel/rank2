import { Component, computed, inject } from '@angular/core';
import { BallotStore } from '../../../ballot/ballot.store';
import { PitchStore } from '../../../pitch/pitch.store';
import { AuthorStore } from '../../../author/author.store';

@Component({
  selector: 'mh5-slates-authored',
  standalone: true,
  imports: [],
  templateUrl: './slates-authored.component.html',
  styleUrl: './slates-authored.component.scss',
})
export class SlatesAuthoredComponent {
  authorStore = inject(AuthorStore);
  ballotStore = inject(BallotStore);
  pitchStore = inject(PitchStore);
  allSlates = computed(() => this.ballotStore.slatesAuthored());

  relevantPitchViewes = computed(() => this.pitchStore.pitchViewsComputed().map(p => p.id));
}
