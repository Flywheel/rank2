import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState } from '@angular-architects/ngrx-toolkit';
import { Contest, ContestView, SlateMember, SlateView } from '../../core/interfaces/interfaces';
import { BallotService } from './ballot.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { LogService } from '../../core/log/log.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    isLoading: false,
  }),
  withComputed(store => {
    return { allContestSlates: computed<SlateView[]>(() => store.allContestViews().map(c => c.slate)) };
  }),
  withMethods(store => {
    const dbBallot = inject(BallotService);
    const logger = inject(LogService);
    return {
      Contests: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Ballot] getAllContests Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbBallot.allContests().pipe(
              takeUntilDestroyed(),
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

      ContestViews: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Ballot] getAllContestViews Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbBallot.allContestViews().pipe(
              takeUntilDestroyed(),
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

      setCurrentContestView: rxMethod<number>(
        pipe(
          tap(() => {
            updateState(store, '[Ballot] getContestViewById Start', { isLoading: true });
          }),
          switchMap(contestId => {
            const existingContestView = store.allContestViews().find(view => view.id === contestId);
            if (existingContestView) {
              return of(existingContestView);
            } else {
              const theContestView = dbBallot.getContestViewById(contestId).pipe(
                tap({
                  next: (contestView: ContestView) => {
                    updateState(store, '[Ballot] Load ContestViewById Success', {
                      allContestViews: [...store.allContestViews(), contestView],
                    });
                  },
                })
              );
              return theContestView;
            }
          }),
          tap(contestView =>
            updateState(store, '[Ballot] getContestViewById Success', {
              currentContestView: contestView,
              contestSlate: store.allContestSlates().filter(a => a.contestId === contestView.id)[0] ?? emptySlateView,
              isLoading: false,
            })
          )
        )
      ),

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

      // setCurrentContestView2: rxMethod<number>(
      //   pipe(
      //     tap(() => {
      //       updateState(store, '[Ballot] getContestViewById Start', { isLoading: true });
      //     }),
      //     switchMap((contestId: number) => {
      //       return dbBallot.allContestViews().pipe(
      //         takeUntilDestroyed(),
      //         tap(() => {
      //           updateState(store, `[Ballot] getContestSlateByContestId Success`, {
      //             currentContestView: store.allContestViews().filter(a => a.id === contestId)[0] ?? contestViewInit,
      //             contestSlate: store.allContestSlates().filter(a => a.contestId === contestId)[0] ?? emptySlateView,
      //           });
      //         })
      //       );
      //     })
      //   )
      // ),

      addContest(contest: Contest) {
        if (logger.enabled) console.log('addContest', contest);
        updateState(store, '[Contest] addContest Pending', { isLoading: true });
        dbBallot
          .contestCreate(contest)
          .pipe(
            tap({
              next: (newContest: Contest) => {
                if (logger.enabled) console.log('newContest', newContest);
                updateState(store, '[Contest] addContest Success', {
                  allContests: [...store.allContests(), newContest],
                  isLoading: false,
                });
              },
              error: error => {
                if (logger.enabled) console.log('error', error);
                updateState(store, '[Contest] addContest Failed', { isLoading: false });
              },
            })
          )
          .subscribe();
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

      async addContestOld(contest: Contest) {
        updateState(store, '[Contest] addContest Pending', { isLoading: true });
        return await dbBallot.ContestCreateOld(contest).then((newContest: Contest) => {
          updateState(store, '[Contest] addContest Success', {
            allContests: [...store.allContests(), newContest],
            isLoading: false,
          });
        });
      },
    };
  }),

  withHooks({
    onInit(store) {
      store.Contests();
      // store.ContestViews();
      store.setCurrentContestView(1);
    },
  })
);
