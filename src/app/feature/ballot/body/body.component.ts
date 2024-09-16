import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ContestView, SlateMemberView, SlateView } from '../../../core/interfaces/interfaces';
import { BallotStore } from '../ballot.store';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LogService } from '../../../core/log/log.service';

@Component({
  selector: 'mh5-body',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CdkDropListGroup, CdkDragHandle],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent {
  authorId = signal<number>(1);
  ballotStore = inject(BallotStore);
  logger = inject(LogService);
  contest = computed<ContestView>(() => this.ballotStore.currentContestView());
  candidateList = computed(() => this.contest().slate.slateMemberViews);
  selectedCandidateId = signal<number>(0);

  candidatesAvailable = signal<SlateMemberView[]>([]);
  candidatesRanked = signal<SlateMemberView[]>([]);
  preparedBallot = signal<SlateView>({ id: 0, contestId: this.contest().id, authorId: this.authorId(), slateMemberViews: [] });
  contentParams = computed<string>(() => {
    const selected = this.candidateList().filter(candidate => candidate.id === this.selectedCandidateId())[0];
    return selected ? selected.placementView.asset.mediaType + '..i..' + selected.placementView.asset.sourceId : '';
  });

  constructor() {
    effect(() => {
      this.contest();
      untracked(() => {
        this.setAvailableCandidates();
      });
    });
  }

  setAvailableCandidates() {
    if (this.logger.enabled) console.log('setAvailableCandidates');
    this.candidatesAvailable.set(this.candidateList());
    if (this.ballotStore.voterSlate()?.slateMemberViews) {
      this.candidatesRanked.set(
        this.ballotStore.voterSlate().slateMemberViews.reduce((acc: SlateMemberView[], slateMemberView: SlateMemberView) => {
          const candidate = this.candidateList().find((candidate: SlateMemberView) => candidate.placementId === slateMemberView.placementId);
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
        authorId: slateMember.authorId,
        slateId: slateMember.slateId,
        contestId: this.contest().id,
        placementId: slateMember.placementId,
        rankOrder: index + 1,
        placementView: slateMember.placementView,
      };
    });
    this.preparedBallot.set({
      id: this.contest().id,
      contestId: this.contest().id,
      authorId: 1,
      slateMemberViews: preparedSlateMemberViews,
    });
    this.ballotStore.updateVoterSlate(this.preparedBallot());
  }
}
