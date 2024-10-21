import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MediaService } from '../../services/media.service';
import { AssetView, PlacementView } from '../../models/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'mh5-viewer',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
})
export class ViewerComponent {
  placementView = input.required<PlacementView>();
  mediaService = inject(MediaService);
  sanitizer = inject(DomSanitizer);

  assetView = computed<AssetView>(() => this.placementView().assetView);
  mediaURL = computed(() => this.mediaService.parseMedia(this.assetView()));

  contentPlayer = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.mediaURL()));

  contentType = computed(() => this.mediaURL()[1]);

  constructor() {
    effect(() => {
      const caption = this.placementView().caption;

      untracked(() => this.placementView());
      console.log(caption);
    });
  }
}
