import { Component, computed, inject } from '@angular/core';
import { PitchView } from '../../../core/models/interfaces';
import { PitchStore } from '../pitch.store';
import { AuthorStore } from '../../author/author.store';

@Component({
  selector: 'mh5-pitch-scroller',
  standalone: true,
  imports: [],
  template: `
    <div class="horizontal-scroll">
      @for (contest of pitchViews(); track $index) {
        <div class="menu-item" (click)="selectContest(contest.id)" (keydown)="selectContest(contest.id)" tabindex="$index">
          {{ contest.title }}
        </div>
      }
    </div>
  `,
  styles: [],
})
export class PitchScrollerComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);
  pitchViews = computed<PitchView[]>(() => this.authorStore.authorChannelViews()[0].pitches.filter(p => p.id > 0));
  selectContest(id: number) {
    this.pitchStore.setPitchSelected(id);
  }
}
