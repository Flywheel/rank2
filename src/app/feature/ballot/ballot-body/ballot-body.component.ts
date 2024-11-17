import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal, untracked } from '@angular/core';
import { PitchView, SlateMemberView, SlateView } from '../../../core/models/interfaces';
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

  candidatesAvailable = signal<SlateMemberView[]>([]);
  candidatesRanked = signal<SlateMemberView[]>([]);

  pitchViewSelected = computed<PitchView>(() => this.pitchStore.pitchViewSelected());
  candidateList = computed(() => this.pitchViewSelected().slateView.slateMemberViews);

  currentSlates = computed(() => this.ballotStore.slatesAuthored().find(s => s.pitchId === this.pitchViewSelected().id));

  hidePlacementDisplay = output<boolean>();
  placementToDisplay = output<SlateMemberView>();

  constructor() {
    effect(() => {
      this.pitchViewSelected();
      untracked(() => {
        this.ballotStore.setCurrentSlateByPitchId(this.pitchViewSelected().id);
        this.setAvailableCandidates();
      });
    });
  }

  viewPlacement(placement: SlateMemberView) {
    this.hidePlacementDisplay.emit(false);
    this.placementToDisplay.emit(placement);
  }

  setAvailableCandidates() {
    const ranksInStore = this.ballotStore.slateInProgress()?.slateMemberViews;
    if (ranksInStore) {
      const candidateMap = this._createCandidateMap(this.candidateList());
      const rankedCandidates = this._getRankedCandidates(ranksInStore, candidateMap);
      const rankedCandidatesIds = this._getRankedCandidateIds(rankedCandidates);
      const availableCandidates = this._filterAvailableCandidates(this.candidateList(), rankedCandidatesIds);

      this.candidatesRanked.set(rankedCandidates);
      this.candidatesAvailable.set(availableCandidates);

      this.updateCurrentSlateSignal();
    }
  }

  private _createCandidateMap(candidates: SlateMemberView[]): Map<number, SlateMemberView> {
    return new Map(candidates.map(candidate => [candidate.placementId, candidate]));
  }

  private _getRankedCandidates(ranksInStore: SlateMemberView[], candidateMap: Map<number, SlateMemberView>): SlateMemberView[] {
    return ranksInStore
      .map(member => candidateMap.get(member.placementId))
      .filter((candidate): candidate is SlateMemberView => !!candidate);
  }

  private _getRankedCandidateIds(rankedCandidates: SlateMemberView[]): Set<number> {
    return new Set(rankedCandidates.map(candidate => candidate.placementId));
  }

  private _filterAvailableCandidates(allCandidates: SlateMemberView[], rankedIds: Set<number>): SlateMemberView[] {
    return allCandidates.filter(candidate => !rankedIds.has(candidate.placementId));
  }

  setAvailableCandidates2() {
    console.log('setAvailableCandidates Start');
    this.candidatesAvailable.set(this.candidateList());
    const ranksInStore = this.ballotStore.slateInProgress()?.slateMemberViews;
    if (ranksInStore) {
      this.candidatesRanked.set(
        ranksInStore.reduce((acc: SlateMemberView[], member: SlateMemberView) => {
          const candidate = this.candidateList().find((candidate: SlateMemberView) => candidate.placementId === member.placementId);
          return candidate ? [...acc, candidate] : acc;
        }, [])
      );
      const rankedCandidatesIds = new Set(this.candidatesRanked().map(candidate => candidate.placementId));
      console.log(rankedCandidatesIds);
      this.candidatesAvailable.set(this.candidatesAvailable().filter(candidate => !rankedCandidatesIds.has(candidate.placementId)));
      //  }
      this.updateCurrentSlateSignal();
    }
  }

  swapItems<T>(array: T[], index1: number, index2: number): T[] {
    const newArray = [...array];
    [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];
    return newArray;
  }

  moveUpOnePosition(candidate: SlateMemberView) {
    const candidates = this.candidatesRanked();
    const index = candidates.findIndex(t => t.placementView.caption === candidate.placementView.caption);

    if (index > 0) {
      const updatedCandidates = this.swapItems(candidates, index, index - 1);
      this.candidatesRanked.set(updatedCandidates);
      this.updateCurrentSlateSignal();
    }
  }

  moveDownOnePosition(candidate: SlateMemberView) {
    const candidates = this.candidatesRanked();
    const index = candidates.findIndex(t => t.placementView.caption === candidate.placementView.caption);

    if (index === candidates.length - 1) {
      this.moveToAvailable(candidate);
      return;
    }

    if (index < this.candidatesRanked().length - 1) {
      const updatedCandidates = this.swapItems(candidates, index, index + 1);
      this.candidatesRanked.set(updatedCandidates);
      this.updateCurrentSlateSignal();
    }
  }

  // moveUpOnePosition(candidate: SlateMemberView) {
  //   const index = this.candidatesRanked().findIndex(t => t.placementView.caption === candidate.placementView.caption);
  //   if (index === 0) return;
  //   const temp = this.candidatesRanked()[index];
  //   this.candidatesRanked.set([
  //     ...this.candidatesRanked().slice(0, index - 1),
  //     temp,
  //     this.candidatesRanked()[index - 1],
  //     ...this.candidatesRanked().slice(index + 1),
  //   ]);
  //   this.updateCurrentSlateSignal();
  // }

  // moveDownOnePosition2(candidate: SlateMemberView) {
  //   const index = this.candidatesRanked().findIndex(t => t.placementView.caption === candidate.placementView.caption);
  //   if (index === this.candidatesRanked().length - 1) this.moveToAvailable(candidate);

  //   if (index < this.candidatesRanked().length - 1) {
  //     const temp = this.candidatesRanked()[index];
  //     this.candidatesRanked.set([
  //       ...this.candidatesRanked().slice(0, index),
  //       this.candidatesRanked()[index + 1],
  //       temp,
  //       ...this.candidatesRanked().slice(index + 2),
  //     ]);
  //     this.updateCurrentSlateSignal();
  //   }
  // }

  moveToAvailable(candidate: SlateMemberView) {
    this.candidatesRanked.set(this.candidatesRanked().filter(t => t.placementView.caption !== candidate.placementView.caption));
    this.candidatesAvailable.set([...this.candidatesAvailable(), candidate]);
    this.updateCurrentSlateSignal();
  }

  moveToSelected(candidate: SlateMemberView) {
    this.candidatesAvailable.set(this.candidatesAvailable().filter(t => t.placementView.caption !== candidate.placementView.caption));
    this.candidatesRanked.set([...this.candidatesRanked(), candidate]);
    this.updateCurrentSlateSignal();
  }

  drop(event: CdkDragDrop<SlateMemberView[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this.candidatesRanked().length !== 0) {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      }
    }
    this.updateCurrentSlateSignal();
  }

  updateCurrentSlateSignal() {
    if (this.candidatesRanked().length === 0) return;
    const preparedSlateMemberViews: SlateMemberView[] = this.candidatesRanked().map((slateMember, index: number) => {
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

    console.log(preparedBallot);

    this.ballotStore.updateSlate(preparedBallot);
  }
}
