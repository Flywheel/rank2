import { Component, computed, inject, input } from '@angular/core';
import { SlateMemberView } from '../../../core/models/interfaces';
import { ContentTransform } from '../../../core/models/mediatypes';
import { MediaService } from '../../../core/services/media.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { IconPlayCircleComponent } from '../../../core/svg/icon-play-circle';
import { IconPlayTriangleComponent } from '../../../core/svg/icon-play-triangle';
import { IconYoutubeComponent } from '../../../core/svg/icon-youtube';
import { IconTiktokComponent } from '../../../core/svg/icon-tiktok';
import { IconYouTubeShortsComponent } from '../../../core/svg/icon-youtube-shorts';
import { MediaType } from '../../../core/models/mediatypes';
import { IconFrameComponent } from '../../../core/svg/icon-frame';

@Component({
  selector: 'mh5-home-slate-member',
  standalone: true,
  imports: [
    NgOptimizedImage,
    IconPlayCircleComponent,
    IconPlayTriangleComponent,
    IconYoutubeComponent,
    IconTiktokComponent,
    IconYouTubeShortsComponent,
    IconFrameComponent,
  ],
  templateUrl: './home-slate-member.component.html',
  styleUrl: './home-slate-member.component.scss',
})
export class HomeSlateMemberComponent {
  mediaService = inject(MediaService);
  sanitizer = inject(DomSanitizer);

  placementInput = input.required<SlateMemberView>();

  sourceId = computed(() => this.placementInput().placementView.assetView.sourceId);
  mediaType = computed(() => this.placementInput().placementView.assetView.mediaType);
  caption = computed(() => this.placementInput().placementView.caption);
  player = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.mediaUrl().url));

  mediaTypes = MediaType;
  mediaUrl = computed<ContentTransform>(() => {
    return this.mediaService.transformCSourcetoContent(this.sourceId(), this.mediaType() as MediaType);
  });
}
