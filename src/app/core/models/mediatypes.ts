export type MediaType = 'youtube' | 'ytshort' | 'tiktok' | 'instagram' | 'twitter' | 'textinput'; // Add other platforms as needed
export type MediaPlatform = YouTube | YouTubeShort | Tiktok | Instagram | Twitter | TextInput; // Add other platform interfaces as needed

interface YouTube {
  mediaType: 'youtube';
  id: string;
}
interface YouTubeShort {
  mediaType: 'ytshort';
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
