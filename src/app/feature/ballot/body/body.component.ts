import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { PitchView, SlateMemberView, SlateView } from '../../../core/models/interfaces';
import { PitchStore } from '../../pitch/pitch.store';
import {
  CdkDrag,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DirectComponent } from '../../pitch/direct/direct.component';
import { BallotStore } from '../ballot.store';

@Component({
  selector: 'mh5-body',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CdkDropListGroup, CdkDragHandle, DirectComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent {
  authorId = signal<string>('');
  pitchStore = inject(PitchStore);
  ballotStore = inject(BallotStore);

  pitch = computed<PitchView>(() => this.pitchStore.pitchViewSelected());
  candidateList = computed(() => this.pitch().slateView.slateMemberViews);

  candidatesAvailable = signal<SlateMemberView[]>([]);
  candidatesRanked = signal<SlateMemberView[]>([]);
  // isTopSlate = computed<boolean>(() => this.pitch().slateView.isTopSlate);
  preparedBallot = signal<SlateView>({
    id: 0,
    pitchId: this.pitch().id,
    authorId: this.authorId(),
    isTopSlate: false,
    slateMemberViews: [],
  });
  // contentParams = computed<string>(() => {
  //   const selected = this.candidateList().filter(candidate => candidate.placementId === this.selectedCandidateId())[0];
  //   return selected ? selected.placementView.assetView.mediaType + '..i..' + selected.placementView.assetView.sourceId : '';
  // });

  constructor() {
    effect(() => {
      this.pitch();
      untracked(() => {
        this.setAvailableCandidates();
      });
    });
  }

  setAvailableCandidates() {
    this.candidatesAvailable.set(this.candidateList());
    if (this.ballotStore.voterSlate()?.slateMemberViews) {
      this.candidatesRanked.set(
        this.ballotStore.voterSlate().slateMemberViews.reduce((acc: SlateMemberView[], slateMemberView: SlateMemberView) => {
          const candidate = this.candidateList().find(
            (candidate: SlateMemberView) => candidate.placementId === slateMemberView.placementId
          );
          return candidate ? [...acc, candidate] : acc;
        }, [])
      );
      const rankedCandidatesIds = new Set(this.candidatesRanked().map(candidate => candidate.placementId));
      this.candidatesAvailable.set(this.candidatesAvailable().filter(candidate => !rankedCandidatesIds.has(candidate.placementId)));
    }
    this.updateCurrentSlateSignal();
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
    console.log('event.', event);
    console.log('event.previousContainer', event.previousContainer);
    console.log('event.container.data', event.container);
    console.log('event.previousContainer.data', event.previousContainer.data);
    console.log('event.container.data', event.container.data);
    console.log('event.previousIndex', event.previousIndex);
    console.log('event.currentIndex', event.currentIndex);
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

  updateCurrentSlateSignal() {
    if (this.candidatesRanked().length === 0) return;
    const preparedSlateMemberViews: SlateMemberView[] = this.candidatesRanked().map((slateMember, index: number) => {
      return {
        id: slateMember.id,
        slateId: slateMember.slateId,
        contestId: this.pitch().id,
        placementId: slateMember.placementId,
        rankOrder: index + 1,
        placementView: slateMember.placementView,
      };
    });
    this.preparedBallot.set({
      id: this.pitch().id,
      pitchId: this.pitch().id,
      authorId: '',
      isTopSlate: false,
      slateMemberViews: preparedSlateMemberViews,
    });
    this.ballotStore.updateBallot(this.preparedBallot());
  }
}
