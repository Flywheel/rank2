import { signalStore, withState, withMethods, withHooks } from '@ngrx/signals';
import { withDevtools, updateState, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { SlateView } from '../../core/models/interfaces';
import { slateViewInit } from '../../core/models/initValues';

export const BallotStore = signalStore(
  { providedIn: 'root' },
  withDevtools('ballots'),
  withState({
    voterSlates: [slateViewInit],
    voterSlate: slateViewInit,
    isLoading: false,
  }),
  withStorageSync({
    key: 'ballots',
    autoSync: false,
  }),

  withMethods(store => {
    // const dbballot = inject(ballotService);
    return {
      async updateBallot(ballot: SlateView) {
        updateState(store, `[Slate] Update Start`, {
          isLoading: true,
        });
        let updatedAuthorSlates = store.voterSlates();
        const slateExists = updatedAuthorSlates.some(b => b.pitchId === ballot.pitchId);
        if (slateExists) {
          updatedAuthorSlates = updatedAuthorSlates.map(b => (b.pitchId === ballot.pitchId ? ballot : b));
        } else {
          updatedAuthorSlates = [...updatedAuthorSlates, ballot];
        }
        updateState(store, `[Slate] Update Success`, {
          voterSlates: updatedAuthorSlates,
          voterSlate: ballot,
          isLoading: false,
        });
      },
    };
  }),

  withHooks({})
);
