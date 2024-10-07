import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Contest, ContestView, SlateMember, SlateView } from '../../core/interfaces/interfaces';
import { ContestService } from './contest.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { contestInit, contestViewInit, placementInit, slateViewInit } from '../../core/interfaces/initValues';

export const ContestStore = signalStore(
  { providedIn: 'root' },
  withDevtools('contests'),
  withState({
    currentContestView: contestViewInit,
    allContestViews: [contestViewInit],
    allContests: [contestInit],
    allPlacements: [placementInit],
    contestSlate: slateViewInit,
    voterSlates: [slateViewInit],
    voterSlate: slateViewInit,
    isLoading: false,
  }),
  withStorageSync({
    key: 'contests',
    autoSync: false,
  }),
  withComputed(store => {
    return {
      allContestSlates: computed<SlateView[]>(() => store.allContestViews().map(c => c.slate)),
    };
  }),
  withMethods(store => {
    const dbContest = inject(ContestService);
    return {
      Contests: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Contest] getAllContests Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbContest.contestsGetAll().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allContests: Contest[]) => {
                  updateState(store, '[Contest] getAllContests Success', value => ({
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
            updateState(store, '[Contest] getAllContestViews Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbContest.contestViewsGetAll().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allContestViews: ContestView[]) => {
                  updateState(store, '[Contest] getAllContestViews Success', value => ({
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
            updateState(store, '[Contest] getContestViewById Start', { isLoading: true });
          }),
          switchMap(contestId => {
            const existingContestView = store.allContestViews().find(view => view.id === contestId);
            if (existingContestView) {
              return of(existingContestView);
            } else {
              const theContestView = dbContest.contestViewGetById(contestId).pipe(
                tap({
                  next: (contestView: ContestView) => {
                    updateState(store, '[Contest] Load ContestViewById Success', {
                      allContestViews: [...store.allContestViews(), contestView],
                    });
                  },
                })
              );
              return theContestView;
            }
          }),
          tap(contestView =>
            updateState(store, '[Contest] getContestViewById Success', {
              currentContestView: contestView,
              contestSlate: store.allContestSlates().filter(a => a.contestId === contestView.id)[0] ?? slateViewInit,
              isLoading: false,
            })
          )
        )
      ),

      async updateVoterSlate(ballot: SlateView) {
        updateState(store, `[Contest] UpdateVoterSlate Start`, {
          isLoading: true,
        });
        let updatedAuthorSlates = store.voterSlates();
        const slateExists = updatedAuthorSlates.some(b => b.contestId === ballot.contestId);
        if (slateExists) {
          updatedAuthorSlates = updatedAuthorSlates.map(b => (b.contestId === ballot.contestId ? ballot : b));
        } else {
          updatedAuthorSlates = [...updatedAuthorSlates, ballot];
        }
        updateState(store, `[Contest] UpdateVoter Slate Success`, {
          voterSlates: updatedAuthorSlates,
          voterSlate: ballot,
          isLoading: false,
        });
      },

      addContest(contest: Contest) {
        if (environment.ianConfig.showLogs) console.log('addContest', contest);
        updateState(store, '[Contest] addContest Pending', { isLoading: true });
        dbContest
          .contestCreate(contest)
          .pipe(
            tap({
              next: (newContest: Contest) => {
                if (environment.ianConfig.showLogs) console.log('newContest', newContest);
                updateState(store, '[Contest] addContest Success', {
                  allContests: [...store.allContests(), newContest],
                  isLoading: false,
                });
              },
              error: error => {
                if (environment.ianConfig.showLogs) console.log('error', error);
                updateState(store, '[Contest] addContest Failed', { isLoading: false });
              },
            })
          )
          .subscribe();
      },

      // addPlacement(placement: Placement) {
      //   if (environment.ianConfig.showLogs) console.log('addPlacement', placement);
      //   updateState(store, '[Placement] addPlacement Pending', { isLoading: true });
      //   dbContest
      //     .placementCreate(placement)
      //     .then(newPlacement => {
      //       if (environment.ianConfig.showLogs) console.log('newPlacement', newPlacement);
      //       updateState(store, '[Placement] addPlacement Success', {
      //         allPlacements: [...store.allPlacements(), newPlacement],
      //         isLoading: false,
      //       });
      //     })
      //     .catch(error => {
      //       if (environment.ianConfig.showLogs) console.log('error', error);
      //       updateState(store, '[Placement] addPlacement Failed', { isLoading: false });
      //     });
      // },

      async addSlateMember(SlateMemberView: SlateMember) {
        updateState(store, '[Contest] addContest Pending', { isLoading: true });
        if (environment.ianConfig.showLogs) console.log('addSlateMember', SlateMemberView);
        // return await dbContest.ContestsCreate(contest).then((newContest: Contest) => {
        //   updateState(store, '[Contest] addContest Success', {
        //     allContests: [...store.allContests(), newContest],
        //     isLoading: false,
        //   });
        // });
      },

      // async getAllSlateMembers() {
      //   // updateState(store, '[Contest] getAllSlateMembers Start', { isLoading: true });
      //   // const slateMembers: SlateMemberView[] = await dbContest.getAllContestViews();
      //   // updateState(store, '[Contest] getAllSlateMembers Success', value => ({
      //   //   ...value,
      //   //   allContests: contests,
      //   //   isLoading: false,
      //   // }));
      // },

      // async getVoterSlateByContestId(contestId: number) {
      //   const voterSlates: SlateView[] = store.voterSlates() ?? [];
      //   const currentVoterSlate: SlateView = voterSlates.filter(a => a.contestId === contestId)[0] ?? emptySlateView;
      //   updateState(store, `[Contest] getCurrentVoterSlateByContestId Success`, {
      //     voterSlate: currentVoterSlate,
      //     voterSlates: voterSlates,
      //   });
      // },

      // setCurrentContestView2: rxMethod<number>(
      //   pipe(
      //     tap(() => {
      //       updateState(store, '[Contest] getContestViewById Start', { isLoading: true });
      //     }),
      //     switchMap((contestId: number) => {
      //       return dbContest.allContestViews().pipe(
      //         takeUntilDestroyed(),
      //         tap(() => {
      //           updateState(store, `[Contest] getContestSlateByContestId Success`, {
      //             currentContestView: store.allContestViews().filter(a => a.id === contestId)[0] ?? contestViewInit,
      //             contestSlate: store.allContestSlates().filter(a => a.contestId === contestId)[0] ?? emptySlateView,
      //           });
      //         })
      //       );
      //     })
      //   )
      // ),
      // async addContestOld(contest: Contest) {
      //   updateState(store, '[Contest] addContest Pending', { isLoading: true });
      //   return await dbContest.ContestCreateOld(contest).then((newContest: Contest) => {
      //     updateState(store, '[Contest] addContest Success', {
      //       allContests: [...store.allContests(), newContest],
      //       isLoading: false,
      //     });
      //   });
      // },
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
