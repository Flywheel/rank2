import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal, untracked } from '@angular/core';
import { PitchView, SlateMemberView, SlateView } from '@shared/models/interfaces';
import { PitchStore } from '../../pitch/pitch.store';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BallotStore } from '../ballot.store';
import { AuthorStore } from '../../author/author.store';

@Component({
  selector: 'mh5-ballot-body',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CdkDragHandle],
  templateUrl: './ballot-body.component.html',
  styleUrl: './ballot-body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotBodyComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);
  ballotStore = inject(BallotStore);

  membersRanked = signal<SlateMemberView[]>([]);

  pitchViewSelected = computed<PitchView>(() => this.pitchStore.pitchViewSelected());
  membersAvailable = computed(() => this.pitchViewSelected().slateView.slateMemberViews);

  membersNotRanked = computed<SlateMemberView[]>(() => {
    const rankedCandidatesIds = this.getRankedMemberIds(this.getRankedMembersFromStore());
    return this.filterAvailableMembers(this.membersAvailable(), rankedCandidatesIds);
  });

  hidePlacementViewer = output<boolean>();
  placementToDisplay = output<SlateMemberView>();
  pitchToDisplay = output<SlateMemberView>();

  initializer = effect(() => {
    this.pitchViewSelected();
    untracked(() => {
      this.membersRanked.set(this.getRankedMembersFromStore());
    });
  });

  viewPlacement(placement: SlateMemberView) {
    console.log('viewPlacement', placement);
    this.hidePlacementViewer.emit(false);
    this.placementToDisplay.emit(placement);
  }

  getRankedMembersFromStore(): SlateMemberView[] {
    const ranksInStore = this.ballotStore.activeSlate()?.slateMemberViews;
    if (!ranksInStore) return [];
    const candidateMap = this.createMemberMap(this.membersAvailable());
    return this.getRankedMembers(ranksInStore, candidateMap);
  }

  private createMemberMap(candidates: SlateMemberView[]): Map<number, SlateMemberView> {
    return new Map(candidates.map(candidate => [candidate.placementId, candidate]));
  }

  private getRankedMembers(ranksInStore: SlateMemberView[], candidateMap: Map<number, SlateMemberView>): SlateMemberView[] {
    return ranksInStore
      .map(member => candidateMap.get(member.placementId))
      .filter((candidate): candidate is SlateMemberView => !!candidate);
  }

  private getRankedMemberIds(rankedCandidates: SlateMemberView[]): Set<number> {
    return new Set(rankedCandidates.map(candidate => candidate.placementId));
  }

  private filterAvailableMembers(allCandidates: SlateMemberView[], rankedIds: Set<number>): SlateMemberView[] {
    return allCandidates.filter(candidate => !rankedIds.has(candidate.placementId));
  }

  swapItems<T>(array: T[], index1: number, index2: number): T[] {
    const newArray = [...array];
    [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];
    return newArray;
  }

  moveUpOnePosition(candidate: SlateMemberView) {
    const candidates = this.membersRanked();
    const index = candidates.findIndex(t => t.placementView.caption === candidate.placementView.caption);

    if (index > 0) {
      const updatedCandidates = this.swapItems(candidates, index, index - 1);
      this.membersRanked.set(updatedCandidates);
      this.updateCurrentSlateSignal();
    }
  }

  moveDownOnePosition(candidate: SlateMemberView) {
    const candidates = this.membersRanked();
    const index = candidates.findIndex(t => t.placementView.caption === candidate.placementView.caption);

    if (index === candidates.length - 1) {
      this.moveToAvailable(candidate);
      return;
    }

    if (index < this.membersRanked().length - 1) {
      const updatedCandidates = this.swapItems(candidates, index, index + 1);
      this.membersRanked.set(updatedCandidates);
      this.updateCurrentSlateSignal();
    }
  }

  moveToAvailable(candidate: SlateMemberView) {
    this.membersRanked.set(this.membersRanked().filter(t => t.placementView.caption !== candidate.placementView.caption));
    this.updateCurrentSlateSignal();
  }

  moveToSelected(candidate: SlateMemberView) {
    this.membersRanked.set([...this.membersRanked(), candidate]);
    this.updateCurrentSlateSignal();
  }

  drop(event: CdkDragDrop<SlateMemberView[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this.membersRanked().length !== 0) {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      }
    }
    this.updateCurrentSlateSignal();
  }

  updateCurrentSlateSignal() {
    if (this.membersRanked().length === 0) return;
    const preparedSlateMemberViews: SlateMemberView[] = this.membersRanked().map((slateMember, index: number) => {
      return {
        id: slateMember.id,
        slateId: slateMember.slateId,
        contestId: this.pitchViewSelected().id,
        placementId: slateMember.placementId,
        rankOrder: index + 1,
        placementView: slateMember.placementView,
      };
    });

    const preparedBallot: SlateView = {
      id: 0,
      pitchId: this.pitchViewSelected().id,
      authorId: this.authorStore.authorLoggedIn().id,
      isTopSlate: false,
      slateMemberViews: preparedSlateMemberViews,
    };

    this.ballotStore.updateSlate(preparedBallot);
  }

  // isCookieStatusAccepted = computed<boolean>(() => this.authorStore.cookieStatus() === 'accepted');
  // showCookieConsentComponent = signal(false);
  // showBallotCaster = signal(false);
  PrepareToPostBallot() {
    // console.log(this.isCookieStatusAccepted());
    // if (this.isCookieStatusAccepted()) {
    //   //   console.log(this.ballotStore.currentSlate());
    //   this.showCookieConsentComponent.set(false);
    //   this.showBallotCaster.set(true);
    // } else {
    //   this.showCookieConsentComponent.set(true);
    // }
  }
}
