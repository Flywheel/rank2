import { Component, computed, inject, output } from '@angular/core';
import { PitchStore } from '@feature/pitch/pitch.store';
import { PitchView, SlateMemberView } from '@shared/models/interfaces';
import { PitchSlateMemberComponent } from '../pitch-slate-member/pitch-slate-member.component';
import { Router } from '@angular/router';
import { ErrorService } from '@shared/services/error.service';
import { PitchMetaComponent } from '@feature/pitch/pitch-meta/pitch-meta.component';
import { SwipeLeftDirective } from '@shared/directives/swipe-left.directive';
import { PitchHelpComponent } from '../pitch-help/pitch-help.component';
import { AuthorStore } from '@feature/author/author.store';

@Component({
  selector: 'mh5-pitch-slate',
  standalone: true,
  imports: [PitchSlateMemberComponent, PitchMetaComponent, SwipeLeftDirective, PitchHelpComponent],
  templateUrl: './pitch-slate.component.html',
  styleUrl: './pitch-slate.component.scss',
})
export class PitchSlateComponent {
  errorService = inject(ErrorService);
  pitchStore = inject(PitchStore);
  authorStore = inject(AuthorStore);
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
      this.router.navigate(['/ballotInSpa', this.pitchViewSelected().id]);
    }
  }

  gotoComments() {
    alert('The comments feature is still in development. Thanks for trying Mini Herald.');
  }

  gotoResults() {
    alert('The comments feature is still in development. Thanks for trying Mini Herald.');
  }
}
