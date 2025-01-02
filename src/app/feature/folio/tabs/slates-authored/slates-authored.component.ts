import { Component, computed, inject } from '@angular/core';
import { BallotStore } from '@feature/ballot/ballot.store';
import { AuthorStore } from '@feature/author/author.store';
import { Router } from '@angular/router';
import { PitchStore } from '@feature/pitch/pitch.store';

@Component({
  selector: 'mh5-slates-authored',
  standalone: true,
  imports: [],
  templateUrl: './slates-authored.component.html',
  styleUrl: './slates-authored.component.scss',
})
export class SlatesAuthoredComponent {
  router = inject(Router);
  authorStore = inject(AuthorStore);
  ballotStore = inject(BallotStore);
  pitchStore = inject(PitchStore);
  allSlates = computed(() => this.ballotStore.slatesAuthored());

  //relevantPitchViewes = computed(() => this.pitchStore.pitchViewsComputed().map(p => p.id));
  // knownPitches = computed(() => {
  //   const xx = this.ballotStore.pitchesKnown();
  //   xx.map(p => ({ ...p, id: p.slateView.slateMemberViews.map(s => s.slateId) }));
  //   return xx;
  // });

  goToBallot = (id: number) => {
    console.log('goToBallot ', id);
    this.pitchStore.setPitchSelected(id);
    this.router.navigate(['/ballot', id]);
  };
}
