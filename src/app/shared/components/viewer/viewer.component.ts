import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '@shared/services/media.service';
import { AssetView, PlacementView } from '@shared/models/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { PitchChooserComponent } from '@feature/pitch/pitch-chooser/pitch-chooser.component';
@Component({
  selector: 'mh5-viewer',
  standalone: true,
  imports: [CommonModule, PitchChooserComponent],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
})
export class ViewerComponent {
  placementView = input.required<PlacementView>();
  mediaService = inject(MediaService);
  sanitizer = inject(DomSanitizer);

  assetView = computed<AssetView>(() => this.placementView().assetView);
  contentType = computed(() => this.assetView().mediaType);
  mediaURL = computed(() => this.mediaService.getUrlFromAsset(this.assetView()));
  contentPlayer = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.mediaURL()));
}
