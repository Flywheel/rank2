import { Component, computed, inject, input } from '@angular/core';
import { SlateMemberView } from '../../../core/models/interfaces';
import { ContentTransform } from '../../../core/models/mediatypes';
import { MediaService } from '../../../core/services/media.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { IconPlayCircleComponent } from '../../../core/svg/icon-play-circle';

@Component({
  selector: 'mh5-home-slate-member',
  standalone: true,
  imports: [NgOptimizedImage, IconPlayCircleComponent],
  templateUrl: './home-slate-member.component.html',
  styleUrl: './home-slate-member.component.scss',
})
export class HomeSlateMemberComponent {
  mediaService = inject(MediaService);
  sanitizer = inject(DomSanitizer);
  defaultImageFolder = '/src/assets/img/aimspoll/';

  placementInput = input.required<SlateMemberView>();
  sourceId = computed(() => this.placementInput().placementView.assetView.sourceId);
  mediaType = computed(() => this.placementInput().placementView.assetView.mediaType);
  caption = computed(() => this.placementInput().placementView.caption);
  player = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.mediaUrl().url));
  pitchImaqe = this.defaultImageFolder + 'Turtle.jpeg';

  mediaUrl = computed<ContentTransform>(() => {
    let retval = {} as ContentTransform;
    switch (this.mediaType()) {
      case 'youtube':
        retval = {
          typeName: 'youtube',
          width: 150,
          height: 150 / 1.33,
          paddingBottom: '56.25%',
          url: 'https://img.youtube.com/vi/' + this.sourceId() + '/0.jpg',
        };
        break;
      case 'jpeg':
        retval = {
          typeName: 'jpeg',
          width: 116,
          height: 202,
          paddingBottom: '56.25%',
          url: this.sourceId(),
        };
        break;
      case 'jpg-280':
        retval = {
          typeName: 'jpg-280',
          width: 100,
          height: 120,
          paddingBottom: '0%',
          url: this.sourceId(),
        };
        break;
      case 'topic':
      case 'ad':
        retval = {
          typeName: 'topic',
          width: 116,
          height: 202,
          paddingBottom: '56.25%',
          url: this.sourceId(),
        };
        break;
      case 'pitch':
        retval = {
          typeName: 'pitch',
          width: 150,
          height: 150 / 1.33,
          paddingBottom: '56.25%',
          url: this.sourceId(),
        };
        break;
    }
    return retval;
  });

  segmentHeight = computed(() => {
    let height = 120;
    switch (this.mediaType()) {
      case 'youtube':
        height = 120;
        break;
      case 'twitter':
      case 'tiktok':
      case 'instagram':
        height = 200;
        break;
      case 'jpeg':
        height = 210;
        break;
      case 'topic':
      case 'pitch':
        height = 150;
        break;
      default:
        height = 120;
    }
    return height;
  });
}
