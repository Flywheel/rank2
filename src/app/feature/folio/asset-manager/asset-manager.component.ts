import { Component, computed, inject, input, signal } from '@angular/core';
import { PitchView, FolioView, PlacementView } from '../../../core/models/interfaces';
import { FolioStore } from '../folio.store';
import { PitchStore } from '../../pitch/pitch.store';
import { AuthorStore } from '../../author/author.store';
import { pitchViewInit, placementViewInit } from '../../../core/models/initValues';
import { ViewerComponent } from '../../../core/viewer/viewer/viewer.component';
import { SlateManagerComponent } from '../slate-manager/slate-manager.component';

@Component({
  selector: 'mh5-asset-manager',
  standalone: true,
  imports: [ViewerComponent, SlateManagerComponent],
  templateUrl: './asset-manager.component.html',
  styleUrl: './asset-manager.component.scss',
})
export class ChannelAssetsComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pitchStore = inject(PitchStore);

  folioList = input<FolioView[]>([]);
  tabSelected = input<string>('');

  firstFolioId = computed<number>(() => this.folioList()?.[0]?.id ?? 0);

  placementsOnSelectedFolio = computed<PlacementView[]>(() => {
    return this.folioStore.folioViewSelected().placementViews ?? [];
  });

  pitchesOnSelectedFolio = computed<PitchView[]>(() => {
    return this.pitchStore.pitchViewsComputed().filter(p => p.folioId === this.folioStore.folioIdSelected()) ?? [];
  });

  pitchesOnFolioCount = computed<number>(() => {
    return this.pitchesOnSelectedFolio()?.length ?? 0;
  });

  selectFolioView(folio: FolioView) {
    this.folioStore.setFolioSelected(folio.id);
  }

  hidePlacementDisplay = signal<boolean>(true);
  placementToDisplay = signal<PlacementView>(placementViewInit);
  displayPlacementAsset(placement: PlacementView) {
    if (placement) {
      this.hidePlacementDisplay.set(false);
      this.placementToDisplay.set(placement);
    } else {
      this.hidePlacementDisplay.set(true);
      this.placementToDisplay.set(placementViewInit);
    }
    console.log(placement.assetView.mediaType);
  }

  hidePitchMananger = signal<boolean>(true);
  pitchToDisplay = signal<PitchView>(pitchViewInit);
  editPitch(pitch: PitchView) {
    console.log(pitch);
    this.pitchStore.setPitchSelected(pitch.id);
    this.hidePitchMananger.set(false);
    this.pitchToDisplay.set(pitch);
    console.log(this.pitchStore.pitchViewSelected());
  }
}
