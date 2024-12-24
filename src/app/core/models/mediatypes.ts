export enum MediaType {
  Youtube = 'youtube',
  YouTubeShort = 'youtubeshort',
  Tiktok = 'tiktok',
  Instagram = 'instagram',
  Twitter = 'twitter',
  Textinput = 'textinput',
  Textcaption = 'textcaption',
  Pitch = 'pitch',
}

export type MediaPlatform = YouTube | YouTubeShort | Tiktok | Instagram | Twitter | TextInput | TextCaption | Pitch;

interface YouTube {
  mediaType: 'youtube';
  id: string;
}
interface YouTubeShort {
  mediaType: 'youtubeshort';
  id: string;
}

interface Tiktok {
  mediaType: 'tiktok';
  user: string;
  videoId: string;
}

interface Instagram {
  mediaType: 'instagram';
  id: string;
}

interface Twitter {
  mediaType: 'twitter';
  user: string;
  statusId: string;
}

interface TextCaption {
  mediaType: 'textcaption';
  theCaption: string;
}
interface Pitch {
  mediaType: 'pitch';
  theCaption: string;
}

interface TextInput {
  mediaType: 'textinput';
  user: string;
  theInput: string;
}

export interface ContentTransform {
  typeName: string;
  width: number;
  height: number;
  paddingBottom: string;
  url: string;
}
