import { signalStore, withState, withComputed, withMethods, withHooks } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Pitch, PitchView, SlateMember, SlateView, SlateMemberView } from '../../core/models/interfaces';
import { pitchInit, pitchViewInit, slateViewInit, slateInit, slateMemberInit, placementViewInit } from '../../core/models/initValues';
import { PitchService } from './pitch.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, map, exhaustMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { FolioStore } from '../folio/folio.store';

export const PitchStore = signalStore(
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
  }),
  withStorageSync({
    key: 'contests',
    autoSync: false,
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
      pitchViewsComputed: computed<PitchView[]>(() =>
        store.pitches().map(pitch => ({
          ...pitch,
          slateId: store.slateViewsComputed().find(s => s.id === pitch.id)?.pitchId ?? 0,
          slateView: store.slateViewsComputed().find(s => s.id === pitch.id) ?? slateViewInit,
        }))
      ),
    };
  }),
  withComputed(store => {
    const folioStore = inject(FolioStore);
    return {
      pitchViewsByFolio: computed<PitchView[]>(() => store.pitchViewsComputed().filter(p => p.folioId === folioStore.folioIdSelected())),
    };
  }),

  withComputed(store => {
    return {
      pitchViewSelected: computed<PitchView>(
        () => store.pitchViewsComputed().filter(p => p.id === store.pitchIdSelected())[0] ?? pitchViewInit
      ),
    };
  }),

  withMethods(store => {
    return {
      async pitchStateToLocalStorage() {
        updateState(store, '[Pitch] WriteToLocalStorage Start', { isLoading: true });
        store.writeToStorage();
        updateState(store, '[Pitch] WriteToLocalStorage Success', { isLoading: false });
      },
    };
  }),
  withMethods(store => {
    const dbContest = inject(PitchService);
    return {
      Contests: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            updateState(store, '[Contest] Load Start', { isLoading: true });
            return dbContest.contestsGetAll().pipe(
              map((allContests: Pitch[]) => {
                updateState(store, '[Contest] Load Success', value => ({
                  ...value,
                  pitches: allContests,
                  isLoading: false,
                }));
                return allContests;
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
                next: (allContestViews: PitchView[]) => {
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

      pitchCreate(pitch: Pitch) {
        if (environment.ianConfig.showLogs) console.log(pitch);
        updateState(store, '[Pitch] Add Start', { isLoading: true });
        dbContest
          .pitchCreate(pitch)
          .pipe(
            tap({
              next: ({ newPitch, newSlate }) => {
                if (environment.ianConfig.showLogs) {
                  console.log(newPitch);
                  console.log(newSlate);
                }
                updateState(store, '[Pitch] Add Success', {
                  pitches: [...store.pitches(), newPitch],
                  slates: [...store.slates(), newSlate],
                  isLoading: false,
                });
                store.writeToStorage();
              },
              error: error => {
                if (environment.ianConfig.showLogs) console.log('error', error);
                updateState(store, '[Pitch] Add Failed', { isLoading: false });
              },
            })
          )
          .subscribe();
      },

      addSlateMembers(slateMembers: SlateMember[]) {
        updateState(store, '[SlateMember] Add Start', { isLoading: true });
        const members = slateMembers.map(slateMember => ({
          id: 0,
          placementId: slateMember.placementId,
          slateId: slateMember.slateId,
          rankOrder: slateMember.rankOrder,
        }));
        dbContest
          .addSlateMembers(members)
          .pipe(
            tap({
              next: newMembers => {
                if (environment.ianConfig.showLogs) console.log('newSlateMember', newMembers);
                updateState(store, '[SlateMember] Add Success', {
                  slateMembers: [...store.slateMembers(), ...newMembers],
                  isLoading: false,
                });
              },
              error: error => {
                if (environment.ianConfig.showLogs) console.log('error', error);
                updateState(store, '[SlateMember] Add Failed', { isLoading: false });
              },
            })
          )
          .subscribe();
      },
    };
  }),

  withHooks({
    // onInit(store) {
    //   // store.Contests();
    //   // store.setCurrentContestView(1);
    // },
  })
);

// contestAdd(contest: Pitch) {
//   if (environment.ianConfig.showLogs) console.log('addContest', contest);
//   updateState(store, '[Contest] Add Start', { isLoading: true });
//   dbContest
//     .contestCreate(contest)
//     .pipe(
//       tap({
//         next: (newContest: Pitch) => {
//           if (environment.ianConfig.showLogs) console.log('newContest', newContest);
//           updateState(store, '[Contest] Add Success', {
//             pitches: [...store.pitches(), newContest],
//             isLoading: false,
//           });
//         },
//         error: error => {
//           if (environment.ianConfig.showLogs) console.log('error', error);
//           updateState(store, '[Contest] Add Failed', { isLoading: false });
//         },
//       })
//     )
//     .subscribe();
// },
// Contests2: rxMethod<void>(
//   pipe(
//     tap(() => {
//       updateState(store, '[Contest] Load Start', { isLoading: true });
//     }),
//     exhaustMap(() => {
//       return dbContest.contestsGetAll().pipe(
//         takeUntilDestroyed(),
//         tap({
//           next: (allContests: Pitch[]) => {
//             updateState(store, '[Contest] Load Success', value => ({
//               ...value,
//               pitches: allContests,
//               isLoading: false,
//             }));
//           },
//         })
//       );
//     })
//   )
// ),
