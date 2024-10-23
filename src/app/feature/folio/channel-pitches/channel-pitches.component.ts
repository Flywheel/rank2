import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { AuthorStore } from '../../author/author.store';
import { PitchStore } from '../../contest/pitch.store';
import { FolioStore } from '../folio.store';
import { PlacementView, SlateMemberView } from '../../../core/models/interfaces';
import {
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  CdkDragHandle,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mh5-channel-pitches',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CdkDrag, CdkDropList, CdkDropListGroup, CdkDragHandle],
  templateUrl: './channel-pitches.component.html',
  styleUrl: './channel-pitches.component.scss',
})
export class ChannelPitchesComponent implements OnInit {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);
  folioStore = inject(FolioStore);
  author = this.authorStore.authorLoggedIn();

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

  ngOnInit(): void {
    this.setAvailableCandidates();
  }
  cancel() {
    this.closeEditor.emit(false);
  }

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
    // }
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
