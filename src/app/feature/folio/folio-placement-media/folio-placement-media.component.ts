import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Asset, AssetView } from '../../../core/models/interfaces';
import { MediaService } from '../../../core/services/media.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'mh5-folio-placement-media',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  templateUrl: './folio-placement-media.component.html',
  styleUrl: './folio-placement-media.component.scss',
})
export class FolioPlacementMediaComponent {
  assetView = input.required<Asset | AssetView>();
  sanitizer = inject(DomSanitizer);

  paddingBottom = '56.25%';
  mediaService = inject(MediaService);
  mediaURL = computed(() => {
    const assetView = this.assetView();
    return assetView ? this.mediaService.parseMedia(assetView) : '';
  });
  contentPlayer = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.mediaURL()));
  runTest() {
    console.log(this.assetView());
    console.log(this.mediaURL());
  }
}
