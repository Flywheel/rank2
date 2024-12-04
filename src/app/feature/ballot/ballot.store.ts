import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { SlateView } from '../../core/models/interfaces';
import { slateViewInit } from '../../core/models/initValues';
import { computed, inject } from '@angular/core';
import { PitchStore } from '../pitch/pitch.store';

export const BallotStore = signalStore(
  { providedIn: 'root' },
  withDevtools('ballots'),
  withState({
    slatesAuthored: [slateViewInit],
    isLoading: false,
  }),
  withStorageSync({
    key: 'ballots',
    autoSync: false,
  }),

  withComputed(store => {
    const pitchStore = inject(PitchStore);
    return {
      activeSlate: computed<SlateView>(
        () => store.slatesAuthored().find(slates => slates.pitchId == pitchStore.pitchIdSelected()) ?? slateViewInit
      ),
    };
  }),

  withMethods(store => {
    return {
      async updateSlate(slateView: SlateView) {
        updateState(store, `[Slate] Update Start`, { isLoading: true });
        let existingSlates = store.slatesAuthored();
        const slateWasFound = existingSlates.some(b => b.pitchId === slateView.pitchId);
        existingSlates = slateWasFound
          ? existingSlates.map(existingSlateView => (existingSlateView.pitchId === slateView.pitchId ? slateView : existingSlateView))
          : [...existingSlates, slateView];
        updateState(store, `[Slate] Update Success`, {
          slatesAuthored: existingSlates.filter(s => s.pitchId !== 0),
          isLoading: false,
        });
      },
    };
  })
);
