import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { Pitch, PitchView, SlateMember, SlateView, SlateMemberView } from '../../core/models/interfaces';
import { pitchInit, pitchViewInit, slateViewInit, slateInit, slateMemberInit, placementViewInit } from '../../core/models/initValues';
import { PitchService } from './pitch.service';
import { computed, inject } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FolioStore } from '../folio/folio.store';

export const PitchStore = signalStore(
  { providedIn: 'root' },
  withDevtools('pitches'),
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
    key: 'pitches',
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
    return {
      async pitchStateToLocalStorage() {
        updateState(store, '[Pitch] WriteToLocalStorage Start', { isLoading: true });
        store.writeToStorage();
        updateState(store, '[Pitch] WriteToLocalStorage Success', { isLoading: false });
      },
    };
  }),
  withMethods(store => {
    const dbPitch = inject(PitchService);
    return {
      setPitchSelected(pitchId: number) {
        updateState(store, `[Pitch] Select By Id  ${pitchId}`, { pitchIdSelected: pitchId });
      },

      pitchCreate(pitch: Pitch) {
        if (environment.ianConfig.showLogs) console.log(pitch);
        updateState(store, '[Pitch] Add Start', { isLoading: true });
        dbPitch
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
        dbPitch
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
  })
);
