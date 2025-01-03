import { Component, computed, inject, input, output, signal } from '@angular/core';
import { PitchView, FolioView, PlacementView } from '@shared/models/interfaces';
import { FolioStore } from '@feature/folio/folio.store';
import { PitchStore } from '@feature/pitch/pitch.store';
import { AuthorStore } from '@feature/author/author.store';
import { pitchViewInit, placementViewInit } from '@shared/models/initValues';
import { ViewerComponent } from '@shared/components/viewer/viewer.component';
import { TopSlateManagerComponent } from '../topslate-manager/topslate-manager.component';
import { IconPitchComponent } from '@shared/svg/icon-pitch';
import { IconYoutubeComponent } from '@shared/svg/icon-youtube';
import { IconTiktokComponent } from '@shared/svg/icon-tiktok';
import { IconYouTubeShortsComponent } from '@shared/svg/icon-youtube-shorts';
import { IconDashboardComponent } from '@shared/svg/icon-dashboard';
import { MediaType } from '@shared/models/mediatypes';

@Component({
  selector: 'mh5-asset-manager',
  standalone: true,
  imports: [
    ViewerComponent,
    TopSlateManagerComponent,
    IconPitchComponent,
    IconYoutubeComponent,
    IconTiktokComponent,
    IconYouTubeShortsComponent,
    IconDashboardComponent,
  ],
  templateUrl: './asset-manager.component.html',
  styleUrl: './asset-manager.component.scss',
})
export class AssetManagerComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pitchStore = inject(PitchStore);

  folioList = input<FolioView[]>([]);
  tabSelected = input<string>('');
  tabWanted = output<string>();

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

  mediaTypes = MediaType;
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
    this.tabWanted.emit('Pitches');
  }
}
