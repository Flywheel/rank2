import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Pitch, ContestView, SlateMember, SlateView, SlateMemberView } from '../../core/models/interfaces';
import { ContestService } from '../contest/contest.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import {
  pitchInit,
  contestViewInit,
  placementInit,
  slateViewInit,
  slateInit,
  slateMemberInit,
  placementViewInit,
} from '../../core/models/initValues';
import { FolioStore } from '../folio/folio.store';

export const ContestStore = signalStore(
  { providedIn: 'root' },
  withDevtools('contests'),
  withState({
    pitchIdSelected: 0,
    pitches: [pitchInit],
    slates: [slateInit],
    slateMembers: [slateMemberInit],

    slateView: slateViewInit,

    isLoading: false,
    isAddingPitch: false,
    isAddingSlate: false,
    isAddingSlateMember: false,

    currentContestView: contestViewInit,
    allContestViews: [contestViewInit],
    allContests: [pitchInit],
    // allPlacements: [placementInit],

    voterSlates: [slateViewInit],
    // pitchedSlates: [slateViewInit],
    voterSlate: slateViewInit,
  }),
  withStorageSync({
    key: 'contests',
    autoSync: false,
  }),
  withComputed(store => {
    return {
      allContestSlates: computed<SlateView[]>(() => store.allContestViews().map(c => c.slateView)),
    };
  }),

  withComputed(store => {
    const folioStore = inject(FolioStore);
    return {
      slateMemberViewsComputed: computed<SlateMemberView[]>(() =>
        store.slateMembers().map(slate => ({
          ...slate,
          placementView: folioStore.placementViewsComputed().find(s => s.id === slate.placementId) ?? placementViewInit,
        }))
      ),
    };
  }),

  withComputed(store => {
    return {
      slateViewsComputed: computed<SlateView[]>(() =>
        store.slates().map(slate => ({
          ...slate,
          slateMemberViews: store.slateMemberViewsComputed().filter(s => s.slateId === slate.id),
        }))
      ),
    };
  }),

  withComputed(store => {
    return {
      pitchViewsComputed: computed<ContestView[]>(() =>
        store.pitches().map(pitch => ({
          ...pitch,
          slateId: store.slateViewsComputed().find(s => s.id === pitch.id)?.contestId ?? 0,
          slateView: store.slateViewsComputed().find(s => s.id === pitch.id) ?? slateViewInit,
        }))
      ),
    };
  }),

  withMethods(store => {
    const dbContest = inject(ContestService);
    return {
      Contests: rxMethod<void>(
        pipe(
          tap(() => {
            updateState(store, '[Contest] Load Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbContest.contestsGetAll().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allContests: Pitch[]) => {
                  updateState(store, '[Contest] Load Success', value => ({
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
            updateState(store, '[ContestView] Load Start', { isLoading: true });
          }),
          exhaustMap(() => {
            return dbContest.contestViewsGetAll().pipe(
              takeUntilDestroyed(),
              tap({
                next: (allContestViews: ContestView[]) => {
                  updateState(store, '[ContestView] Load Success', value => ({
                    ...value,
                    allContestViews,
                    isLoading: false,
                  }));
                },
              })
            );
          })
        )
      ),

      setPitchSelected(pitchId: number) {
        updateState(store, `[Pitch] Select By Id  ${pitchId}`, { pitchIdSelected: pitchId });
      },

      setCurrentContestView: rxMethod<number>(
        pipe(
          tap(() => {
            updateState(store, '[ContestView] Load By Id Start', { isLoading: true });
          }),
          switchMap(contestId => {
            const existingContestView = store.allContestViews().find(view => view.id === contestId);
            if (existingContestView) {
              return of(existingContestView);
            } else {
              const theContestView = dbContest.contestViewGetById(contestId).pipe(
                tap({
                  next: (contestView: ContestView) => {
                    updateState(store, '[ContestView] Load By Id Success', {
                      allContestViews: [...store.allContestViews(), contestView],
                    });
                  },
                })
              );
              return theContestView;
            }
          }),
          tap(contestView =>
            updateState(store, '[ContestView] -- From Cache --Load By Id Success', {
              currentContestView: contestView,
              slateView: store.allContestSlates().filter(a => a.contestId === contestView.id)[0] ?? slateViewInit,
              isLoading: false,
            })
          )
        )
      ),

      //#region Ballot
      async updateVoterSlate(ballot: SlateView) {
        updateState(store, `[Slate] Update Start`, {
          isLoading: true,
        });
        let updatedAuthorSlates = store.voterSlates();
        const slateExists = updatedAuthorSlates.some(b => b.contestId === ballot.contestId);
        if (slateExists) {
          updatedAuthorSlates = updatedAuthorSlates.map(b => (b.contestId === ballot.contestId ? ballot : b));
        } else {
          updatedAuthorSlates = [...updatedAuthorSlates, ballot];
        }
        updateState(store, `[Slate] Update Success`, {
          voterSlates: updatedAuthorSlates,
          voterSlate: ballot,
          isLoading: false,
        });
      },

      //#endregion Ballot

      contestAdd(contest: Pitch) {
        if (environment.ianConfig.showLogs) console.log('addContest', contest);
        updateState(store, '[Contest] Add Start', { isLoading: true });
        dbContest
          .contestCreate(contest)
          .pipe(
            tap({
              next: (newContest: Pitch) => {
                if (environment.ianConfig.showLogs) console.log('newContest', newContest);
                updateState(store, '[Contest] Add Success', {
                  allContests: [...store.allContests(), newContest],
                  isLoading: false,
                });
              },
              error: error => {
                if (environment.ianConfig.showLogs) console.log('error', error);
                updateState(store, '[Contest] Add Failed', { isLoading: false });
              },
            })
          )
          .subscribe();
      },

      contestAddWithSlate(contest: Pitch) {
        if (environment.ianConfig.showLogs) console.log('addContest', contest);
        updateState(store, '[Contest] Add Start', { isLoading: true });
        dbContest
          .contestCreateWithSlate(contest)
          .pipe(
            tap({
              next: ({ newPitch, newSlate }) => {
                if (environment.ianConfig.showLogs) {
                  console.log(newPitch);
                  console.log(newSlate);
                }
                updateState(store, '[Contest] Add Success', {
                  allContests: [...store.allContests(), newPitch],
                  isLoading: false,
                });
              },
              error: error => {
                if (environment.ianConfig.showLogs) console.log('error', error);
                updateState(store, '[Contest] Add Failed', { isLoading: false });
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
