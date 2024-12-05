import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { PitchView, SlateView } from '../../core/models/interfaces';
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

  withComputed(() => {
    const pitchStore = inject(PitchStore);
    return {
      pitchesKnown: computed<PitchView[]>(() => pitchStore.pitchViewsComputed().filter(p => p.id > 0)),
    };
  }),

  withMethods(store => {
    return {
      async updateSlate(slateView: SlateView) {
        updateState(store, `[Slate] Update Start`, { isLoading: true });
        let authoredSlates = store.slatesAuthored();
        const isSlateFound = authoredSlates.some(b => b.pitchId === slateView.pitchId);
        authoredSlates = isSlateFound
          ? authoredSlates.map(existingSlateView => (existingSlateView.pitchId === slateView.pitchId ? slateView : existingSlateView))
          : [...authoredSlates, slateView];
        updateState(store, `[Slate] Update Success`, {
          slatesAuthored: authoredSlates.filter(s => s.pitchId !== 0),
          isLoading: false,
        });
      },
    };
  })
);
