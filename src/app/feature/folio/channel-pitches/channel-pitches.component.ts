import { Component, computed, inject, signal } from '@angular/core';
import { ContestNewComponent } from '../../contest/contest-new/contest-new.component';
import { AuthorStore } from '../../author/author.store';
import { ContestStore } from '../../contest/contest.store';
import { FolioStore } from '../folio.store';
import { ContestView, Pitch, Placement, PlacementView, SlateMember, SlateMemberView } from '../../../core/models/interfaces';

@Component({
  selector: 'mh5-channel-pitches',
  standalone: true,
  imports: [ContestNewComponent],
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
  pitch = computed<ContestView>(() => this.pitchStore.pitchViewSelected());

  slateMembers = computed<Partial<SlateMemberView[]>>(() => {
    return this.folioMembers().map(folioMember => {
      return {
        id: 0,
        authorId: this.author.id,
        placementId: folioMember.id,
        rankOrder: 0,
        slateId: this.pitch().slateId,
        placementView: {
          id: 0,
          folioId: this.folioStore.folioViewSelected().id,
          assetId: folioMember.assetId,
          caption: folioMember.caption,
          asset: {
            id: 0,
            mediaType: 'folio',
            sourceId: folioMember.id.toString() || '0',
          },
        },
      } as SlateMemberView;
    });
  });

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
