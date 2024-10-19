import { Component, computed, inject, signal } from '@angular/core';
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
export class ChannelPitchesComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(ContestStore);
  folioStore = inject(FolioStore);
  author = this.authorStore.authorLoggedIn();

  folioMembers = computed<PlacementView[]>(() => this.folioStore.folioViewSelected().placementViews);

  thePitchId = computed<number>(() => this.pitchStore.pitchIdSelected());
  thePitch = computed<PitchView>(() => this.pitchStore.pitchViewSelected());

  slateMembersAvailable = signal<SlateMemberView[]>([]);

  pitchedCandidatesInStore = computed<SlateMemberView[]>(() => this.pitchStore.pitchViewSelected().slateView.slateMemberViews);

  pitchedCandidatesOnList = signal<SlateMemberView[]>([]);

  placementsLocal = signal<Placement[]>([]);

  slateMembers = computed<Partial<SlateMemberView[]>>(() => {
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
          asset: {
            id: 0,
            mediaType: folioMember.asset.mediaType,
            sourceId: folioMember.asset.sourceId,
          },
        },
      } as SlateMemberView;
    });
  });

  moveFolioPlacementToPitch(virtualSlateMemberView: SlateMemberView) {
    //  const contentEntity = this.contentStore.allContentViews().find((c) => c.id === virtualSlateMemberView.contentEntity.id);

    //if (contentEntity !== undefined) {
    const slateMemberView: SlateMemberView = {
      id: 0,
      authorId: this.author.id,
      slateId: this.thePitch().slateId,
      placementId: virtualSlateMemberView.id,
      rankOrder: this.pitchedCandidatesOnList().length + 1,
      placementView: virtualSlateMemberView.placementView,
    };
    console.log(slateMemberView);
    this.pitchedCandidatesOnList.set([...this.pitchedCandidatesOnList(), slateMemberView]);
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
