import { signalStore, withState, withMethods, withHooks, withComputed } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { PitchView, SlateView } from '../../core/models/interfaces';
import { pitchViewInit, slateViewInit } from '../../core/models/initValues';
import { PitchStore } from '../pitch/pitch.store';
import { computed, inject } from '@angular/core';

export const BallotStore = signalStore(
  { providedIn: 'root' },
  withDevtools('ballots'),
  withState({
    authoredSlates: [slateViewInit],
    pitchedSlate: slateViewInit,
    currentBallotSlate: slateViewInit,
    isLoading: false,
  }),
  withStorageSync({
    key: 'ballots',
    autoSync: false,
  }),

  withComputed(store => {
    const pitchStore = inject(PitchStore);
    const currentPitchId = pitchStore.pitchViewSelected().id;
    return {
      currentSlateComputed: computed(() => store.authoredSlates().find(s => s.pitchId === currentPitchId) ?? slateViewInit),
    };
  }),

  withMethods(store => {
    // const dbballot = inject(ballotService);
    // const pitchStore = inject(PitchStore);
    return {
      setCurrentSlateByPitchId(pitchId: number) {
        // const currentSlate: SlateView = pitchStore.pitchViewSelected().slateView ?? [];
        const currentSlate: SlateView = store.authoredSlates().find(slates => slates.pitchId == pitchId) ?? slateViewInit;
        updateState(store, `[Ballot] CurrentSlate Set Success, ${pitchId}`, { currentBallotSlate: currentSlate });
      },

      // getAllSlatesByLoggedInAuthor(authorId: number) {
      //   const allSlatesByAuthor: SlateView[] = store.authoredSlates() ?? [slateViewInit, authorId];
      //   updateState(store, '[Ballot] getAllSlatesByAuthor Success', { authoredSlates: allSlatesByAuthor });
      // },

      async updateSlate(slate: SlateView) {
        console.log(slate);
        updateState(store, `[Slate] Update Start`, {
          isLoading: true,
        });
        let updatedAuthorSlates = store.authoredSlates();
        const slateExists = updatedAuthorSlates.some(b => b.pitchId === slate.pitchId);
        if (slateExists) {
          updatedAuthorSlates = updatedAuthorSlates.map(b => (b.pitchId === slate.pitchId ? slate : b));
        } else {
          updatedAuthorSlates = [...updatedAuthorSlates, slate];
        }
        console.log(updatedAuthorSlates);
        updateState(store, `[Slate] Update Success`, {
          authoredSlates: updatedAuthorSlates.filter(s => s.pitchId !== 0),
          currentBallotSlate: slate,
          isLoading: false,
        });
      },
    };
  }),

  withHooks({})
);
