import { Component, computed, inject, output } from '@angular/core';
import { PitchStore } from '../../pitch/pitch.store';
import { PitchView, SlateMemberView } from '../../../core/models/interfaces';
import { HomeSlateMemberComponent } from '../home-slate-member/home-slate-member.component';
import { Router } from '@angular/router';

@Component({
  selector: 'mh5-home-pitch',
  standalone: true,
  imports: [HomeSlateMemberComponent],
  templateUrl: './home-pitch.component.html',
  styleUrl: './home-pitch.component.scss',
})
export class HomePitchComponent {
  pitchStore = inject(PitchStore);
  router = inject(Router);
  pitchViewSelected = computed<PitchView>(() => this.pitchStore.pitchViewSelected());
  hidePlacementViewer = output<boolean>();
  placementToDisplay = output<SlateMemberView>();

  viewPlacement(slateMember: SlateMemberView) {
    console.log(slateMember.placementView.assetView.mediaType);
    if (slateMember.placementView.assetView.mediaType !== 'folio') {
      this.hidePlacementViewer.emit(false);
      this.placementToDisplay.emit(slateMember);
    } else {
      console.log(slateMember);
      this.router.navigate(['/pitch', slateMember.placementView.assetView.sourceId]);
    }
  }
  gotoBallot() {
    if (this.pitchViewSelected().id > 0) {
      this.router.navigate(['/ballot', this.pitchViewSelected().id]);
    }
  }

  gotoComments() {
    alert('The comments feature is still in development. Thanks for trying Mini Herald.');
    // if (this.logger.enabled) {
    //   console.log(this.slateMemberViews());
    // }
  }
  closeWaitingComponent() {
    //  this.showWaitingComponent.set(false);
  }

  gotoResults() {
    //  this.showWaitingComponent.set(true);
  }
}
