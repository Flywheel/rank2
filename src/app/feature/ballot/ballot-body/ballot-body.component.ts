import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal, untracked } from '@angular/core';
import { PitchView, SlateMemberView, SlateView } from '../../../core/models/interfaces';
import { PitchStore } from '../../pitch/pitch.store';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BallotStore } from '../ballot.store';

@Component({
  selector: 'mh5-ballot-body',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CdkDragHandle],
  templateUrl: './ballot-body.component.html',
  styleUrl: './ballot-body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotBodyComponent {
  authorId = signal<string>('');
  pitchStore = inject(PitchStore);
  ballotStore = inject(BallotStore);

  candidatesAvailable = signal<SlateMemberView[]>([]);
  candidatesRanked = signal<SlateMemberView[]>([]);

  pitchViewSelected = computed<PitchView>(() => this.pitchStore.pitchViewSelected());
  candidateList = computed(() => this.pitchViewSelected().slateView.slateMemberViews);

  hidePlacementDisplay = output<boolean>();
  placementToDisplay = output<SlateMemberView>();
  currentSlates = computed(
    () => this.ballotStore.authoredSlates().find(s => s.pitchId === this.pitchViewSelected().id) ?? this.ballotStore.currentBallotSlate()
  );

  constructor() {
    effect(() => {
      this.pitchViewSelected();
      untracked(() => {
        console.log(this.pitchViewSelected());
        this.setAvailableCandidates();
      });
    });
  }

  viewPlacement(placement: SlateMemberView) {
    this.hidePlacementDisplay.emit(false);
    this.placementToDisplay.emit(placement);
  }

  setAvailableCandidates() {
    console.log('setAvailableCandidates Start');
    this.candidatesAvailable.set(this.candidateList());
    const ranksInStore = this.ballotStore.currentBallotSlate()?.slateMemberViews;

    console.log(this.pitchStore.pitchViewSelected().id);
    console.log(this.ballotStore.authoredSlates());
    const theBallot = this.ballotStore.authoredSlates()?.find(p => p.pitchId == this.pitchStore.pitchViewSelected().id);
    console.log(theBallot);
    // if (theBallot) {
    //   const ranksInStore = theBallot.slateMemberViews;
    console.log(ranksInStore);
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

  moveUpOnePosition(candidate: SlateMemberView) {
    const index = this.candidatesRanked().findIndex(t => t.placementView.caption === candidate.placementView.caption);
    if (index === 0) return;

    const temp = this.candidatesRanked()[index];
    this.candidatesRanked.set([
      ...this.candidatesRanked().slice(0, index - 1),
      temp,
      this.candidatesRanked()[index - 1],
      ...this.candidatesRanked().slice(index + 1),
    ]);
    this.updateCurrentSlateSignal();
  }

  moveDownOnePosition(candidate: SlateMemberView) {
    const index = this.candidatesRanked().findIndex(t => t.placementView.caption === candidate.placementView.caption);
    if (index === this.candidatesRanked().length - 1) this.moveToAvailable(candidate);

    if (index < this.candidatesRanked().length - 1) {
      const temp = this.candidatesRanked()[index];
      this.candidatesRanked.set([
        ...this.candidatesRanked().slice(0, index),
        this.candidatesRanked()[index + 1],
        temp,
        ...this.candidatesRanked().slice(index + 2),
      ]);
      this.updateCurrentSlateSignal();
    }
  }

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
    // console.log('event.', event);
    // console.log('event.previousContainer', event.previousContainer);
    // console.log('event.container.data', event.container);
    // console.log('event.previousContainer.data', event.previousContainer.data);
    // console.log('event.container.data', event.container.data);
    // console.log('event.previousIndex', event.previousIndex);
    // console.log('event.currentIndex', event.currentIndex);
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

  drop2(event: CdkDragDrop<SlateMemberView[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.updateCurrentSlateSignal();
  }

  preparedBallot = signal<SlateView>({
    id: 0,
    pitchId: this.pitchViewSelected().id,
    authorId: this.authorId(),
    isTopSlate: false,
    slateMemberViews: [],
  });

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
    this.preparedBallot.set({
      id: this.pitchViewSelected().id,
      pitchId: this.pitchViewSelected().id,
      authorId: '',
      isTopSlate: false,
      slateMemberViews: preparedSlateMemberViews,
    });
    this.ballotStore.updateSlate(this.preparedBallot());
  }
}
