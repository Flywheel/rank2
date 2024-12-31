import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Pitch, PitchView, SlateMember, SlateView, SlateMemberView, Slate } from '@shared/models/interfaces';
import { pitchInit, pitchViewInit, slateViewInit, slateInit, slateMemberInit, placementViewInit } from '@shared/models/initValues';
import { PitchService } from './pitch.service';
import { computed, inject } from '@angular/core';
import { firstValueFrom, mergeMap, pipe, switchMap, tap } from 'rxjs';
import { FolioStore } from '../folio/folio.store';
import { ErrorService } from '@shared/services/error.service';
import { ActionKeyService } from '@shared/services/action-key.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

const featureKey = 'Pitch';
export const PitchStore = signalStore(
  { providedIn: 'root' },
  withDevtools(featureKey),
  withState({
    pitchIdSelected: 0,
    pitches: [pitchInit],
    slates: [slateInit],
    slateMembers: [slateMemberInit],

    isLoading: false,
    isAddingPitch: false,
    isAddingSlate: false,
    isAddingSlateMember: false,
    newPitch: pitchInit,
    newSlate: slateInit,

    pitchViaRxMethod: pitchInit,
    pitchesViaRxMethod: [pitchInit],
  }),

  withStorageSync({
    key: featureKey,
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
          slateMemberViews: store
            .slateMemberViewsComputed()
            .filter(s => s.slateId === slate.id && s.placementView.assetView.mediaType !== 'folio'),
        }))
      ),
    };
  }),

  withComputed(store => {
    return {
      pitchViewsComputed: computed<PitchView[]>(() =>
        store.pitches().map(pitch => ({
          ...pitch,
          id: pitch.id,
          authorId: pitch.authorId,
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
    const dbPitch = inject(PitchService);
    const errorService = inject(ErrorService);
    const handleError = errorService.handleSignalStoreResponse;
    const actionKeyService = inject(ActionKeyService);
    const actionKeys = actionKeyService.getActionEvents(featureKey);
    return {
      async createPitchAndSlate(pitchPrep: Partial<Pitch>): Promise<{ newPitch: Pitch; newSlate: Slate }> {
        const actionKey = actionKeys('Create Pitch with Slate');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          const { newPitch, newSlate } = await firstValueFrom(dbPitch.createPitchWithSlate(pitchPrep));

          updateState(store, actionKey.success + ' Pitch', {
            pitches: [...store.pitches(), newPitch],
          });
          updateState(store, actionKey.success + ' Slate', {
            slates: [...store.slates(), newSlate],
            isLoading: false,
          });

          store.writeToStorage();
          return { newPitch, newSlate };
        } catch (error) {
          handleError(error, actionKey.failed);
          updateState(store, actionKey.failed, { isLoading: false });
        }
        return { newPitch: pitchInit, newSlate: slateInit };
      },

      addSlateMembers1: rxMethod<SlateMember[]>(
        pipe(
          mergeMap(slateMembers => {
            const actionKey = actionKeys('Add Slatemembers');
            updateState(store, actionKey.event, { isLoading: true });
            const members = slateMembers.map(slateMember => ({
              id: 0,
              placementId: slateMember.placementId,
              slateId: slateMember.slateId,
              rankOrder: slateMember.rankOrder,
            }));
            const newMembers = dbPitch.addSlateMembers(members).pipe(
              tap({
                next: members => {
                  console.log('New members added:', members);
                  updateState(store, actionKey.success, {
                    slateMembers: [...store.slateMembers(), ...members],
                    isLoading: false,
                  });
                  store.writeToStorage();
                },
                error: error => {
                  handleError(error, actionKey.failed);
                  updateState(store, actionKey.failed, { isLoading: false });
                },
              })
            );

            return newMembers;
          })
        )
      ),
      setPitchSelected(pitchId: number) {
        updateState(store, `[${featureKey}] Select By Id  ${pitchId}`, { pitchIdSelected: pitchId });
      },

      async addSlateMembers(slateMembers: SlateMember[]) {
        const actionKey = actionKeys('Add Slatemembers');
        updateState(store, actionKey.event, { isLoading: true });
        try {
          const members = slateMembers.map(slateMember => ({
            id: 0,
            placementId: slateMember.placementId,
            slateId: slateMember.slateId,
            rankOrder: slateMember.rankOrder,
          }));
          const newMembers = await firstValueFrom(dbPitch.addSlateMembers(members));
          updateState(store, actionKey.success, {
            slateMembers: [...store.slateMembers(), ...newMembers],
            isLoading: false,
          });
          store.writeToStorage();
        } catch (error) {
          handleError(error, actionKey.failed);
          updateState(store, actionKey.failed, { isLoading: false });
        }
      },

      loadPitchByIdViaRxMethod: rxMethod<number>(
        pipe(
          switchMap(pitchId => {
            const actionKey = actionKeys('Load Pitches From DB');
            updateState(store, actionKey.event, { isLoading: true });
            const thePitch = dbPitch.getPitchById(pitchId).pipe(
              tap({
                next: (pitch: Pitch) => {
                  updateState(store, actionKey.success, {
                    pitchesViaRxMethod: [...store.pitchesViaRxMethod(), pitch],
                    pitchViaRxMethod: pitch,
                  });
                },
                error: error => {
                  handleError(error, actionKey.failed);
                  updateState(store, actionKey.failed, { isLoading: false });
                },
              })
            );
            return thePitch;
          })
        )
      ),
    };
  })
);

// withMethods(store => {
//   return {
//     rxSLateMaker: (x: SlateMember[]) =>
//     {
//    const newMembersSignal = signal<SlateMember[]>([]);

//       store.addSlateMembersRX(x);
//       return x;
//   };
// })
// createPitchOld(pitch: Pitch) {
//   const actionKey = actionKeys('Create Pitch');
//   updateState(store, actionKey.event, { isLoading: true });
//   dbPitch
//     .createPitchWithSlate(pitch)
//     .pipe(
//       tap({
//         next: ({ newPitch, newSlate }) => {
//           updateState(store, actionKey.success, {
//             pitches: [...store.pitches(), newPitch],
//             slates: [...store.slates(), newSlate],
//             isLoading: false,
//           });
//           store.writeToStorage();
//         },
//         error: error => {
//           handleError(error, actionKey.failed);
//           updateState(store, actionKey.failed, { isLoading: false });
//         },
//       })
//     )
//     .subscribe();
// },

// async createPitchAndSlate3(pitchPrep: Partial<Pitch>): Promise<{ newPitch: Pitch; newSlate: Slate }> {
//   updateState(store, '[Pitch] Create Start', { isLoading: true });
//   const { newPitch, newSlate } = await firstValueFrom(
//     dbPitch.createPitchWithSlate(pitchPrep).pipe(
//       catchError(error => {
//         handleError(error, 'Pitch and Slate Create Failed');
//         updateState(store, '[Pitch] Create Failed', { isLoading: false });
//         return throwError(error);
//       })
//     )
//   );

//   updateState(store, '[Pitch] Add Success', {
//     pitches: [...store.pitches(), newPitch],
//     isLoading: false,
//   });
//   updateState(store, '[Slate] Add Success', {
//     slates: [...store.slates(), newSlate],
//     isLoading: false,
//   });

//   store.writeToStorage();
//   return { newPitch, newSlate };
// },
// withMethods(store => {
//   return {
//     async pitchStateToLocalStorage() {
//       updateState(store, '[Pitch] WriteToLocalStorage Start', { isLoading: true });
//       store.writeToStorage();
//       updateState(store, '[Pitch] WriteToLocalStorage Success', { isLoading: false });
//     },
//   };
// }),

// createPitch: rxMethod<Pitch>(
//   pipe(
//     exhaustMap(pitch => {
//       const actionKey = actionKeys('Create Pitch');
//       updateState(store, actionKey.event, { isLoading: true });
//       return dbPitch.createPitchWithSlate(pitch).pipe(
//         tap({
//           next: ({ newPitch, newSlate }) => {
//             updateState(store, actionKey.success, {
//               pitches: [...store.pitches(), newPitch],
//               slates: [...store.slates(), newSlate],
//               isLoading: false,
//             });
//             store.writeToStorage();
//           },
//           error: error => {
//             handleError(error, actionKey.failed);
//             updateState(store, actionKey.failed, { isLoading: false });
//           },
//         })
//       );
//     })
//   )
// ),
