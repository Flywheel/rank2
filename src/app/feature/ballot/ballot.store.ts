import { signalStore, withState, withMethods } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { SlateView } from '../../core/models/interfaces';
import { slateViewInit } from '../../core/models/initValues';

export const BallotStore = signalStore(
  { providedIn: 'root' },
  withDevtools('ballots'),
  withState({
    slatesAuthored: [slateViewInit],
    slateInProgress: slateViewInit,
    isLoading: false,
  }),
  withStorageSync({
    key: 'ballots',
    autoSync: false,
  }),

  withMethods(store => {
    return {
      setCurrentSlateByPitchId(pitchId: number) {
        const currentSlate: SlateView = store.slatesAuthored().find(slates => slates.pitchId == pitchId) ?? slateViewInit;
        updateState(store, `[Ballot] CurrentSlate Set Success, ${pitchId}`, { slateInProgress: currentSlate });
      },

      async updateSlate(slate: SlateView) {
        updateState(store, `[Slate] Update Start`, { isLoading: true });
        let updatedAuthorSlates = store.slatesAuthored();
        const slateExists = updatedAuthorSlates.some(b => b.pitchId === slate.pitchId);
        if (slateExists) {
          updatedAuthorSlates = updatedAuthorSlates.map(b => (b.pitchId === slate.pitchId ? slate : b));
        } else {
          updatedAuthorSlates = [...updatedAuthorSlates, slate];
        }
        updateState(store, `[Slate] Update Success`, {
          slatesAuthored: updatedAuthorSlates.filter(s => s.pitchId !== 0),
          slateInProgress: slate,
          isLoading: false,
        });
      },
    };
  })
);
