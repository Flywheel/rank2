import { Component, computed, inject, input } from '@angular/core';
import { SlateMemberView } from '@shared/models/interfaces';
import { ContentTransform } from '@shared/models/mediatypes';
import { MediaService } from '@shared/services/media.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { IconPlayCircleComponent } from '@shared/svg/icon-play-circle';
import { IconPlayTriangleComponent } from '@shared/svg/icon-play-triangle';
import { IconYoutubeComponent } from '@shared/svg/icon-youtube';
import { IconTiktokComponent } from '@shared/svg/icon-tiktok';
import { IconYouTubeShortsComponent } from '@shared/svg/icon-youtube-shorts';
import { MediaType } from '@shared/models/mediatypes';
import { IconFrameComponent } from '@shared/svg/icon-frame';

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
