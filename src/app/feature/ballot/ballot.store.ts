import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { PitchView, SlateView } from '@shared/models/interfaces';
import { slateViewInit } from '@shared/models/initValues';
import { computed, inject } from '@angular/core';
import { PitchStore } from '../pitch/pitch.store';
import { ActionKeyService } from '@shared/services/action-key.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

const featureKey = 'Ballot';

export const BallotStore = signalStore(
  { providedIn: 'root' },
  withDevtools('ballots'),
  withState({
    slatesAuthored: [slateViewInit],
    isLoading: false,
  }),
  withStorageSync({
    key: featureKey,
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
    const actionKeyService = inject(ActionKeyService);
    const actionKeys = actionKeyService.getActionEvents(featureKey);
    return {
      updateSlate: rxMethod<SlateView>(
        pipe(
          tap(slateView => {
            const actionKey = actionKeys('Update Slate');
            updateState(store, actionKey.event, { isLoading: true });
            let authoredSlates = store.slatesAuthored();

            const isSlateFound = authoredSlates.some(b => b.pitchId === slateView.pitchId);
            authoredSlates = isSlateFound
              ? authoredSlates.map(existingSlateView => (existingSlateView.pitchId === slateView.pitchId ? slateView : existingSlateView))
              : [...authoredSlates, slateView];

            updateState(store, actionKey.success, {
              slatesAuthored: authoredSlates.filter(s => s.pitchId !== 0),
              isLoading: false,
            });
          })
        )
      ),
    };
  })
);

// async updateSlate1(slateView: SlateView) {
//   const actionKey = actionKeys('Update Slate');
//   updateState(store, actionKey.event, { isLoading: true });
//   let authoredSlates = store.slatesAuthored();
//   const isSlateFound = authoredSlates.some(b => b.pitchId === slateView.pitchId);
//   authoredSlates = isSlateFound
//     ? authoredSlates.map(existingSlateView => (existingSlateView.pitchId === slateView.pitchId ? slateView : existingSlateView))
//     : [...authoredSlates, slateView];
//   updateState(store, actionKey.success, {
//     slatesAuthored: authoredSlates.filter(s => s.pitchId !== 0),
//     isLoading: false,
//   });
// },
