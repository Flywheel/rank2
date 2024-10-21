import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ContestNewComponent } from '../../contest/contest-new/contest-new.component';
import { AuthorStore } from '../../author/author.store';
import { ContestStore } from '../../contest/contest.store';
import { FolioStore } from '../folio.store';
import { PitchView, Placement, PlacementView, SlateMemberView } from '../../../core/models/interfaces';
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

  imports: [CommonModule, FormsModule, RouterLink, CdkDrag, CdkDropList, CdkDropListGroup, CdkDragHandle, ContestNewComponent],

  templateUrl: './channel-pitches.component.html',
  styleUrl: './channel-pitches.component.scss',
})
export class ChannelPitchesComponent implements OnInit {
  authorStore = inject(AuthorStore);
  pitchStore = inject(ContestStore);
  folioStore = inject(FolioStore);
  author = this.authorStore.authorLoggedIn();

  folioMembersx = computed<PlacementView[]>(() => this.folioStore.folioViewSelected().placementViews);
  folioMembers = input.required<PlacementView[]>();
  pitchViews = input<PitchView[]>();

  folioIdSelected = computed<number>(() => this.folioStore.folioIdSelected());

  thePitchId = computed<number>(() => this.pitchStore.pitchIdSelected());
  thePitch = computed<PitchView>(() => this.pitchStore.pitchViewSelected());

  placementsLocal = signal<Placement[]>([]);

  slateMembersAvailable = signal<SlateMemberView[]>([]);
  slateMembersAdded = signal<SlateMemberView[]>([]);
  slateMembersCastFromFolio = computed<SlateMemberView[]>(() => {
    return this.folioMembers().map(folioMember => {
      return {
        id: 0,
        authorId: this.author.id,
        placementId: folioMember.id,
        rankOrder: 0,
        slateId: this.thePitch().slateId,
        placementView: {
          id: 0,
          folioId: folioMember.folioId,
          assetId: folioMember.assetId,
          caption: folioMember.caption,
          assetView: {
            id: 0,
            mediaType: folioMember.assetView.mediaType,
            sourceId: folioMember.assetView.sourceId,
          },
        },
      } as SlateMemberView;
    });
  });

  closeEditor = output<boolean>();

  ngOnInit(): void {
    this.setAvailableCandidates();
  }
  cancel() {
    this.closeEditor.emit(false);
  }

  setAvailableCandidates() {
    console.log(this.pitchStore.currentPitchView().slateView.slateMemberViews);
    this.slateMembersAdded.set(this.pitchStore.currentPitchView().slateView.slateMemberViews);
    const rankedCandidatesIds = new Set(
      this.pitchStore.currentPitchView().slateView.slateMemberViews.map(candidate => candidate.placementView.id)
    );
    this.slateMembersAvailable.set(
      this.slateMembersCastFromFolio().filter(candidate => !rankedCandidatesIds.has(candidate.placementView.id))
    );
  }

  addPlacementToPitch(virtualSlateMemberView: SlateMemberView) {
    //  const contentEntity = this.contentStore.allContentViews().find((c) => c.id === virtualSlateMemberView.contentEntity.id);

    //if (contentEntity !== undefined) {
    const slateMemberView: SlateMemberView = {
      id: 0,
      authorId: this.author.id,
      slateId: this.thePitch().slateId,
      placementId: virtualSlateMemberView.id,
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

  //  slateMembersAvailableComputedFromTopicMembersInStore = computed<SlateMemberView[]>(() => {
  //   const xx = this.folioMembers()

  //     // .map((topicMember) => {

  //     //   return {
  //     //     id: 0,
  //     //     pitchId: this.pitchStore.currentPitchView().id,
  //     //     slateId: this.pitchStore.currentPitchView().topSlateId,
  //     //     topicMemberId: topicMember.id,
  //     //     contentEntity: {
  //     //       id: topicMember.contentId,
  //     //       caption: topicMember.caption,
  //     //       contentType: { id: contentEntity?.contentTypeId, name: 'TopicMember' },
  //     //       sourceId: '',
  //     //     },
  //     //   } as SlateMemberView;
  //     // });
  //   return xx;
  // });
}
