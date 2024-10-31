import { signalStore, withState, withMethods, withHooks, withComputed } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { PitchView, SlateView } from '../../core/models/interfaces';
import { slateViewInit } from '../../core/models/initValues';
import { PitchStore } from '../pitch/pitch.store';
import { computed, inject } from '@angular/core';

export const BallotStore = signalStore(
  { providedIn: 'root' },
  withDevtools('ballots'),
  withState({
    authoredSlates: [slateViewInit],
    pitchedSlate: slateViewInit,
    currentSlate: slateViewInit,
    isLoading: false,
  }),
  withStorageSync({
    key: 'ballots',
    autoSync: false,
  }),

  withMethods(store => {
    // const dbballot = inject(ballotService);
    const pitchStore = inject(PitchStore);
    return {
      setPitchedSlateByPitchId(pitchId: number) {
        const currentSlate: SlateView = pitchStore.pitchViewSelected().slateView ?? [];
        updateState(store, `[Ballot] getCurrentSlateByPitchId Success, ${pitchId}`, { currentSlate: currentSlate });
      },

      async updateBallot(ballot: SlateView) {
        updateState(store, `[Slate] Update Start`, {
          isLoading: true,
        });
        let updatedAuthorSlates = store.authoredSlates();
        const slateExists = updatedAuthorSlates.some(b => b.pitchId === ballot.pitchId);
        if (slateExists) {
          updatedAuthorSlates = updatedAuthorSlates.map(b => (b.pitchId === ballot.pitchId ? ballot : b));
        } else {
          updatedAuthorSlates = [...updatedAuthorSlates, ballot];
        }
        updateState(store, `[Slate] Update Success`, {
          authoredSlates: updatedAuthorSlates,
          currentSlate: ballot,
          isLoading: false,
        });
      },
    };
  }),

  withHooks({})
);
