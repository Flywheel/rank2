import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { PitchView, FolioView, PlacementView } from '../../../core/models/interfaces';
import { FolioStore } from '../folio.store';
import { ContestStore } from '../../contest/contest.store';
import { AuthorStore } from '../../author/author.store';
import { ChannelPitchesComponent } from '../channel-pitches/channel-pitches.component';
import { pitchViewInit, placementViewInit } from '../../../core/models/initValues';
import { ViewerComponent } from '../../../core/viewer/viewer/viewer.component';

@Component({
  selector: 'mh5-channel-assets',
  standalone: true,
  imports: [ChannelPitchesComponent, ViewerComponent],
  templateUrl: './channel-assets.component.html',
  styleUrl: './channel-assets.component.scss',
})
export class ChannelAssetsComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pitchStore = inject(ContestStore);
  folioList = input<FolioView[]>([]);
  tabSelected = input<string>('');
  showPitchMananger = signal<boolean>(false);

  placements = computed<PlacementView[]>(() => {
    return this.folioStore.folioViewSelected().placementViews ?? [];
  });

  pitchesBySelectedFolio = computed<PitchView[]>(() => {
    return this.pitchStore.allContestViews().filter(a => a.authorId === this.authorStore.authorLoggedIn().id) ?? [];
  });

  pitchesOnFolio = computed<PitchView[]>(() => {
    return this.pitchStore.pitchViewsComputed().filter(p => p.folioId === this.folioStore.folioIdSelected()) ?? [];
  });
  pitchesOnFolioCount = computed<number>(() => {
    return this.pitchesOnFolio()?.length ?? 0;
  });

  firstFolioId = computed<number>(() => this.folioList()?.[0]?.id ?? 0);

  // constructor() {
  //   effect(() => {
  //     const folioId = this.firstFolioId();
  //     if (folioId > 0) {
  //       const fv = this.folioList().filter(f => f.id === folioId)[0];
  //       untracked(() => {
  //         this.folioStore.setFolioSelected(fv.id);
  //       });
  //     }
  //   });
  // }

  selectFolioView(folio: FolioView) {
    this.folioStore.setFolioSelected(folio.id);
    this.pitchStore.setPitchSelected(folio.id);
  }

  hidePlacementDisplay = signal<boolean>(true);
  placementToDisplay = signal<PlacementView>(placementViewInit);

  displayAsset(placement: PlacementView) {
    if (placement) {
      this.hidePlacementDisplay.set(false);
      this.placementToDisplay.set(placement);
    } else {
      this.hidePlacementDisplay.set(true);
      this.placementToDisplay.set(placementViewInit);
    }
    console.log(placement.assetView.mediaType);

    //create event for logging placement seen
  }

  pitchToDisplay = signal<PitchView>(pitchViewInit);
  editPitch(pitch: PitchView) {
    this.showPitchMananger.set(true);
    this.pitchToDisplay.set(pitch);
  }
}
