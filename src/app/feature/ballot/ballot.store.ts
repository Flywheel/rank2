import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState } from '@angular-architects/ngrx-toolkit';
import { Contest, ContestView, SlateView } from '../../core/models/models';
import { BallotService } from './ballot.service';
import { computed, inject } from '@angular/core';

const emptySlateView: SlateView = {
  id: 0,
  contestId: 0,
  authorId: 0,
  slateMemberViews: [],
};

const emptycontest: Contest = {
  id: 0,
  authorId: 0,
  opens: new Date('1922-01-03'),
  closes: new Date('1922-01-04'),
  topSlateId: 0,
  contestTitle: '',
  contestDescription: '',
};
const emptycontestView: ContestView = {
  id: 0,
  authorId: 0,
  opens: new Date('1922-01-03'),
  closes: new Date('1922-01-04'),
  topSlateId: 0,
  contestTitle: '',
  contestDescription: '',
  slate: emptySlateView,
};

export const BallotStore = signalStore(
  { providedIn: 'root' },
  withDevtools('ballots'),
  withState({
    currentContestView: emptycontestView,
    allContestViews: [emptycontestView],
    allContests: [emptycontest],
    contestSlate: emptySlateView,
    voterSlates: [emptySlateView],
    voterSlate: emptySlateView,
    isStartupLoadingComplete: false,
    isLoading: false,
  }),
  withComputed(store => {
    return { allContestSlates: computed<SlateView[]>(() => store.allContestViews().map(c => c.slate)) };
  }),
  withMethods(store => {
    const dbBallot = inject(BallotService);
    return {
      async getAllContests() {
        updateState(store, '[Ballot] getAllContests Start', { isLoading: true });
        const contests: Contest[] = await dbBallot.ContestsGet();
        updateState(store, '[Ballot] getAllContests Success', value => ({
          ...value,
          allContests: contests,
          isLoading: false,
        }));
      },

      async getContestSlateByContestId(contestId: number) {
        updateState(store, `[Ballot] getContestSlateByContestId Success`, {
          currentContestView: store.allContestViews().filter(a => a.id === contestId)[0] ?? emptycontestView,
          contestSlate: store.allContestSlates().filter(a => a.contestId === contestId)[0] ?? emptySlateView,
        });
      },

      async getVoterSlateByContestId(contestId: number) {
        const voterSlates: SlateView[] = store.voterSlates() ?? [];
        const currentVoterSlate: SlateView = voterSlates.filter(a => a.contestId === contestId)[0] ?? emptySlateView;
        updateState(store, `[Ballot] getCurrentVoterSlateByContestId Success`, {
          voterSlate: currentVoterSlate,
          voterSlates: voterSlates,
        });
      },

      async updateVoterSlate(ballot: SlateView) {
        updateState(store, `[Ballot] UpdateVoterSlate Start`, {
          isLoading: true,
        });
        let updatedAuthorSlates = store.voterSlates();
        const slateExists = updatedAuthorSlates.some(b => b.contestId === ballot.contestId);
        if (slateExists) {
          updatedAuthorSlates = updatedAuthorSlates.map(b => (b.contestId === ballot.contestId ? ballot : b));
        } else {
          updatedAuthorSlates = [...updatedAuthorSlates, ballot];
        }
        updateState(store, `[Ballot] UpdateVoter Slate Success`, {
          voterSlates: updatedAuthorSlates,
          voterSlate: ballot,
          isLoading: false,
        });
      },
      async setStartupLoadingComplete(state: boolean) {
        updateState(store, '[Ballot] setStartupLoadingComplete Success', { isStartupLoadingComplete: state });
      },
    };
  }),

  withHooks(store => ({
    onInit: async () => {
      await store.getAllContests();
      await store.setStartupLoadingComplete(true);
    },
  }))
);
