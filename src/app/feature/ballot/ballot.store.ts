import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState } from '@angular-architects/ngrx-toolkit';
import { Contest, ContestView, SlateMember, SlateView } from '../../core/interfaces/interfaces';
import { BallotService } from './ballot.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { LogService } from '../../core/log/log.service';

const emptySlateView: SlateView = {
  id: 0,
  contestId: 0,
  authorId: 0,
  slateMemberViews: [],
};

export const contestInit: Contest = {
  id: 0,
  authorId: 0,
  opens: new Date('1922-01-03'),
  closes: new Date('1922-01-04'),
  topSlateId: 0,
  contestTitle: '',
  contestDescription: '',
};
const contestViewInit: ContestView = {
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
    currentContestView: contestViewInit,
    allContestViews: [contestViewInit],
    allContests: [contestInit],
    contestSlate: emptySlateView,
    voterSlates: [emptySlateView],
    voterSlate: emptySlateView,
    //  isStartupLoadingComplete: false,
    isLoading: false,
  }),
  withComputed(store => {
    return { allContestSlates: computed<SlateView[]>(() => store.allContestViews().map(c => c.slate)) };
  }),
  withMethods(store => {
    const dbBallot = inject(BallotService);
    const logger = inject(LogService);
    return {
      rxContests: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Ballot] getAllContests Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbBallot.allContests().pipe(
              tap({
                next: (allContests: Contest[]) => {
                  updateState(store, '[Ballot] getAllContests Success', value => ({
                    ...value,
                    allContests,
                    isLoading: false,
                  }));
                },
              })
            );
          })
        )
      ),

      rxContestViews: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Ballot] getAllContestViews Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbBallot.allContestViews().pipe(
              tap({
                next: (allContestViews: ContestView[]) => {
                  updateState(store, '[Ballot] getAllContestViews Success', value => ({
                    ...value,
                    allContestViews,
                    isLoading: false,
                    //isStartupLoadingComplete: true,
                  }));
                },
              })
            );
          })
        )
      ),

      rxContestViewById: rxMethod<number>(
        pipe(
          tap(() => {
            updateState(store, '[Ballot] getContestViewById Start', { isLoading: true });
          }),
          switchMap((contestId: number) => {
            return dbBallot.allContestViews().pipe(
              tap(() => {
                updateState(store, `[Ballot] getContestSlateByContestId Success`, {
                  currentContestView: store.allContestViews().filter(a => a.id === contestId)[0] ?? contestViewInit,
                  contestSlate: store.allContestSlates().filter(a => a.contestId === contestId)[0] ?? emptySlateView,
                });
              })
            );
          })
        )
      ),

      async addContest(contest: Contest) {
        updateState(store, '[Contest] addContest Pending', { isLoading: true });
        return await dbBallot.ContestCreate(contest).then((newContest: Contest) => {
          updateState(store, '[Contest] addContest Success', {
            allContests: [...store.allContests(), newContest],
            isLoading: false,
          });
        });
      },

      async addSlateMember(SlateMemberView: SlateMember) {
        updateState(store, '[Contest] addContest Pending', { isLoading: true });
        if (logger.enabled) console.log('addSlateMember', SlateMemberView);
        // return await dbBallot.ContestsCreate(contest).then((newContest: Contest) => {
        //   updateState(store, '[Contest] addContest Success', {
        //     allContests: [...store.allContests(), newContest],
        //     isLoading: false,
        //   });
        // });
      },

      // async getAllSlateMembers() {
      //   // updateState(store, '[Ballot] getAllSlateMembers Start', { isLoading: true });
      //   // const slateMembers: SlateMemberView[] = await dbBallot.getAllContestViews();
      //   // updateState(store, '[Ballot] getAllSlateMembers Success', value => ({
      //   //   ...value,
      //   //   allContests: contests,
      //   //   isLoading: false,
      //   // }));
      // },

      // async getVoterSlateByContestId(contestId: number) {
      //   const voterSlates: SlateView[] = store.voterSlates() ?? [];
      //   const currentVoterSlate: SlateView = voterSlates.filter(a => a.contestId === contestId)[0] ?? emptySlateView;
      //   updateState(store, `[Ballot] getCurrentVoterSlateByContestId Success`, {
      //     voterSlate: currentVoterSlate,
      //     voterSlates: voterSlates,
      //   });
      // },

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
    };
  }),

  withHooks({
    onInit(store) {
      store.rxContests();
      store.rxContestViews();
      store.rxContestViewById(1);
    },
  })
);
