import { Component, computed, inject, output } from '@angular/core';
import { PitchView } from '../../../core/models/interfaces';
import { ContestStore } from '../../contest/contest.store';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-contest-scroll-horizontal',
  standalone: true,
  imports: [],
  templateUrl: './contest-scroll-horizontal.component.html',
  styleUrl: './contest-scroll-horizontal.component.scss',
})
export class ContestScrollHorizontalComponent {
  pitchStore = inject(ContestStore);
  pitchViews = computed<PitchView[]>(() => this.pitchStore.pitchViewsComputed().filter(p => p.id > 0));
  newContestEditorStateChange = output<boolean>();
  newPlacementEditorStateChange = output<boolean>();

  selectContest(id: number) {
    this.pitchStore.setPitchSelected(id);
    if (environment.ianConfig.showLogs) {
      console.log('selectContest', id);

      console.log('allContests', this.pitchStore.pitches());
    }
  }
}
