import { Component, computed, inject, input, signal } from '@angular/core';
import { FolioView, PlacementView } from '../../../core/models/interfaces';
import { FolioStore } from '../folio.store';

@Component({
  selector: 'mh5-channel-assets',
  standalone: true,
  imports: [],
  templateUrl: './channel-assets.component.html',
  styleUrl: './channel-assets.component.scss',
})
export class ChannelAssetsComponent {
  folioStore = inject(FolioStore);
  lister = input<FolioView[]>([]);
  selectedFolioId = signal(0);

  placementsBySelectedFolio = computed<PlacementView[]>(() => {
    return this.lister()[0].placementViews ?? [];
  });

  showPlacements(folioID: number) {
    console.log(folioID);
    console.log(this.lister());
    console.log(this.placementsBySelectedFolio());
  }

  displayAsset(placement: PlacementView) {
    console.log(placement.asset.mediaType);
  }

  save() {
    this.folioStore.folioStateToLocalStorage();
  }
}
