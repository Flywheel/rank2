import { Component, computed, inject, output } from '@angular/core';
import { PitchStore } from '../../pitch/pitch.store';
import { PitchView, SlateMemberView } from '@shared/models/interfaces';
import { HomeSlateMemberComponent } from '../home-slate-member/home-slate-member.component';
import { Router } from '@angular/router';
import { ErrorService } from '@shared/services/error.service';
import { PitchMetaComponent } from '../pitch-meta/pitch-meta.component';

@Component({
  selector: 'mh5-home-pitch',
  standalone: true,
  imports: [HomeSlateMemberComponent, PitchMetaComponent],
  templateUrl: './home-pitch.component.html',
  styleUrl: './home-pitch.component.scss',
})
export class HomePitchComponent {
  errorService = inject(ErrorService);
  pitchStore = inject(PitchStore);
  router = inject(Router);

  pitchViewSelected = computed<PitchView>(() => this.pitchStore.pitchViewSelected());
  hidePlacementViewer = output<boolean>();
  placementToDisplay = output<SlateMemberView>();
  pitchToDisplay = output<SlateMemberView>();

  viewPlacement(slateMember: SlateMemberView) {
    console.log(slateMember);
    if (slateMember.placementView.assetView.mediaType !== 'pitch') {
      this.hidePlacementViewer.emit(false);
      this.placementToDisplay.emit(slateMember);
    } else {
      const pitchId = Number(slateMember.placementView.assetView.sourceId);
      this.pitchStore.setPitchSelected(pitchId);
      this.pitchToDisplay.emit(slateMember);
    }
  }
  gotoBallot() {
    if (this.pitchViewSelected().id > 0) {
      this.router.navigate(['/ballot', this.pitchViewSelected().id]);
    }
  }

  gotoComments() {
    alert('The comments feature is still in development. Thanks for trying Mini Herald.');
  }

  gotoResults() {
    alert('The comments feature is still in development. Thanks for trying Mini Herald.');
  }
}
