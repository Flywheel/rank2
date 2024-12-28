import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { AuthorStore } from '../../../author/author.store';
import { PitchStore } from '../../../pitch/pitch.store';
import { FolioStore } from '../../folio.store';
import { PitchView, PlacementView, SlateMemberView } from '@core/models/interfaces';
import {
  CdkDrag,
  CdkDropList,
  // CdkDropListGroup,
  CdkDragHandle,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mh5-topslate-manager',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CdkDrag,
    CdkDropList,
    // CdkDropListGroup,
    CdkDragHandle,
  ],
  templateUrl: './topslate-manager.component.html',
  styleUrl: './topslate-manager.component.scss',
})
export class TopSlateManagerComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);
  folioStore = inject(FolioStore);
  author = this.authorStore.authorLoggedIn();

  pitchViewSelected = computed<PitchView>(() => this.pitchStore.pitchViewSelected());

  folioMembers = input.required<PlacementView[]>();

  slateMembersCastFromFolio = computed<SlateMemberView[]>(() =>
    this.folioMembers().map(({ id, folioId, assetId, caption, assetView }) => ({
      id: 0,
      authorId: this.author.id,
      placementId: id,
      rankOrder: 0,
      slateId: this.pitchStore.pitchViewSelected().slateId,
      placementView: {
        id,
        folioId,
        assetId,
        caption,
        authorId: this.author.id,
        assetView: {
          id: assetView.id,
          mediaType: assetView.mediaType,
          sourceId: assetView.sourceId,
          authorId: this.author.id,
          url: assetView.url,
        },
      },
    }))
  );

  closeEditor = output<boolean>();
  slateMembersAvailable = signal<SlateMemberView[]>([]);
  slateMembersAdded = signal<SlateMemberView[]>([]);

  reset = effect(() => {
    this.pitchViewSelected();
    untracked(() => {
      this.setAvailableCandidates();
    });
  });

  setAvailableCandidates() {
    this.slateMembersAdded.set(this.pitchStore.pitchViewSelected().slateView.slateMemberViews);
    const rankedCandidatesIds = new Set(
      this.pitchStore.pitchViewSelected().slateView.slateMemberViews.map(candidate => candidate.placementView.id)
    );
    this.slateMembersAvailable.set(
      this.slateMembersCastFromFolio().filter(candidate => !rankedCandidatesIds.has(candidate.placementView.id))
    );
  }

  addPlacementToPitch(virtualSlateMemberView: SlateMemberView) {
    const slateMemberView: SlateMemberView = {
      id: virtualSlateMemberView.id,
      placementId: virtualSlateMemberView.placementId,
      slateId: this.pitchStore.pitchViewSelected().slateId,
      rankOrder: this.slateMembersAdded().length + 1,
      placementView: virtualSlateMemberView.placementView,
    };
    console.log(slateMemberView);
    this.slateMembersAdded.set([...this.slateMembersAdded(), slateMemberView]);
    this.slateMembersAvailable.set(this.slateMembersAvailable().filter(t => t.placementId !== virtualSlateMemberView.placementId));
  }

  drop(event: CdkDragDrop<SlateMemberView[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  submitSlate() {
    this.pitchStore.addSlateMembers(this.slateMembersAdded());
    this.closeEditor.emit(false);
  }
}
