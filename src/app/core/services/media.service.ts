import { Injectable } from '@angular/core';
import { Asset, AssetView } from '../models/interfaces';
import { environment } from '../../../environments/environment';
import { MediaPlatform } from '../models/mediatypes';
import { assetInit } from '../models/initValues';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  public castUrlToAsset(input: string): Asset {
    let match: RegExpExecArray | null;
    for (const [key, value] of Object.entries(mediaPlatforms)) {
      match = value.regex.exec(input);
      console.log(key, match);
      if (match) {
        const result = value.parse(match);
        if (result !== null) {
          const idPosition = key == 'tiktok' ? 2 : 1;
          return {
            mediaType: result.mediaType,
            sourceId: match ? match[idPosition] : '',
            authorId: '1',
            id: 0,
          } as Asset;
        }
      }
    }
    return assetInit;
  }

  public getUrlFromAsset(content: Asset | AssetView): string {
    if (environment.ianConfig.showLogs) console.log(content);
    const mediaType = content.mediaType;
    switch (mediaType) {
      case 'youtube':
        return `https://www.youtube.com/embed/${content.sourceId}`;
      case 'youtubeshort':
        return `https://www.youtube.com/embed/${content.sourceId}`;
      case 'tiktok':
        return `https://www.tiktok.com/embed//${content.sourceId}?music_info=1&description=1`;
      case 'instagram':
        return `https://www.instagram.com/p/${content.sourceId}`;
      case 'twitter':
        return `https://twitframe.com/show?url=https://twitter.com/twitter/status/${content.sourceId}`;
      case 'folio':
        return content.sourceId;
      default:
        return '';
    }
  }
}

export const mediaPlatforms = {
  youtube: {
    regex: /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    parse: (match: RegExpExecArray): MediaPlatform => ({
      mediaType: 'youtube',
      id: match[1],
    }),
  },
  youtubeshort: {
    regex: /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    parse: (match: RegExpExecArray): MediaPlatform => ({
      mediaType: 'youtubeshort',
      id: match[1],
    }),
  },

  tiktok: {
    regex: /tiktok\.com\/@([a-zA-Z0-9._-]+)\/video\/(\d+)/,
    parse: (match: RegExpExecArray): MediaPlatform => ({
      mediaType: 'tiktok',
      user: match[1],
      videoId: match[2],
    }),
  },
  instagram: {
    regex: /instagram\.com\/p\/(\S+)/,
    parse: (match: RegExpExecArray): MediaPlatform => ({
      mediaType: 'instagram',
      id: match[1],
    }),
  },
  twitter: {
    regex: /twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/,
    parse: (match: RegExpExecArray): MediaPlatform => ({
      mediaType: 'twitter',
      user: match[1],
      statusId: match[2],
    }),
  },
};

//https://youtube.com/shorts/j7cygX2gdBY?si=TKUBfoJe4Snk34xM
