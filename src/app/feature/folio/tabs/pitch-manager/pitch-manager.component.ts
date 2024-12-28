import { Component, computed, inject, signal } from '@angular/core';
import { TopSlateManagerComponent } from '../topslate-manager/topslate-manager.component';
import { FolioStore } from '../../folio.store';
import { PitchView } from '@core/models/interfaces';
import { pitchViewInit } from '@core/models/initValues';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mh5-pitch-manager',
  standalone: true,
  imports: [TopSlateManagerComponent, FormsModule],
  templateUrl: './pitch-manager.component.html',
  styleUrl: './pitch-manager.component.scss',
})
export class PitchManagerComponent {
  folioStore = inject(FolioStore);
  selectedPitch = signal<PitchView>(pitchViewInit);
  folioPitches = computed(() => this.folioStore.folioViewSelected().placementViews.filter(p => p.assetView.mediaType === 'pitch'));
  placementViews = computed(() => this.folioStore.folioViewSelected().placementViews.filter(p => p.assetView.mediaType !== 'folio'));
  selectPitch(pitch: PitchView) {
    this.selectedPitch.set(pitch);
  }
}
