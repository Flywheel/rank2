import { Component, computed, inject, output } from '@angular/core';
import { PitchStore } from '../../pitch/pitch.store';
import { PitchView, SlateMemberView } from '../../../core/models/interfaces';

@Component({
  selector: 'mh5-home-pitch',
  standalone: true,
  imports: [],
  templateUrl: './home-pitch.component.html',
  styleUrl: './home-pitch.component.scss',
})
export class HomePitchComponent {
  pitchStore = inject(PitchStore);
  pitchViewSelected = computed<PitchView>(() => this.pitchStore.pitchViewSelected());
  hidePlacementDisplay = output<boolean>();
  placementToDisplay = output<SlateMemberView>();

  viewPlacement(placement: SlateMemberView) {
    this.hidePlacementDisplay.emit(false);
    this.placementToDisplay.emit(placement);
  }
  gotoBallot() {
    // if (this.pitchId()) {
    //   this.router.navigate(['/ballot', this.pitchId()]);
    // }
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
