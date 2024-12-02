import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../services/media.service';
import { AssetView, PlacementView } from '../../models/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { PitchShellComponent } from '../../../feature/pitch/pitch-shell/pitch-shell.component';
@Component({
  selector: 'mh5-viewer',
  standalone: true,
  imports: [CommonModule, PitchShellComponent],
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
