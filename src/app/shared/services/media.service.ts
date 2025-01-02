import { Injectable } from '@angular/core';
import { Asset, AssetView } from '@shared/models/interfaces';
import { environment } from 'src/environments/environment';
import { ContentTransform, MediaPlatform, MediaType } from '@shared/models/mediatypes';
import { assetInit } from '@shared/models/initValues';

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

  transformCSourcetoContent(source: string, mediaType: MediaType): ContentTransform {
    let retval = {} as ContentTransform;
    switch (mediaType) {
      case MediaType.Youtube:
        retval = {
          typeName: 'youtube',
          width: 150,
          height: 150 / 1.33,
          paddingBottom: '56.25%',
          segmentHeight: 120,
          url: 'https://img.youtube.com/vi/' + source + '/0.jpg',
        };
        break;
      case MediaType.Tiktok:
        retval = {
          typeName: 'tiktok',
          width: 150,
          height: 150 / 1.33,
          segmentHeight: 200,
          paddingBottom: '56.25%',
          url: source,
        };
        break;
      case MediaType.Pitch:
        retval = {
          typeName: 'pitch',
          width: 150,
          height: 40,
          paddingBottom: '0%',
          segmentHeight: 50,
          url: source,
        };
        break;
    }
    return retval;
  }

  // case MediaType.jpeg:
  //   retval = {
  //     typeName: 'jpeg',
  //     width: 116,
  //     height: 202,
  //     paddingBottom: '56.25%',
  //     url: source,
  //   };
  //   break;
  // case MediaType.jpg-280:
  //   retval = {
  //     typeName: 'jpg-280',
  //     width: 100,
  //     height: 120,
  //     paddingBottom: '0%',
  //     url: source,
  //   };
  //   break;
  // case 'topic':
  // case 'ad':
  //   retval = {
  //     typeName: 'topic',
  //     width: 116,
  //     height: 202,
  //     paddingBottom: '56.25%',
  //     url: this.sourceId(),
  //   };
  //   break;
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
