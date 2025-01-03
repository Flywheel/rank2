export interface EventLog {
  id: number;
  authorId: string;
  eventText: string;
  eventDate: Date;
}

export interface TabList {
  name: string;
  title: string;
}
export interface TreeNode {
  name: string;
  children?: TreeNode[];
  isSelected?: boolean;
}

export interface Author {
  id: string;
  name: string;
}

export interface AuthorView extends Author {
  authorFolio: FolioView;
  pitches: PitchView[];
}

export interface Asset {
  id: number;
  authorId: string;
  mediaType: string;
  sourceId: string;
}

export interface AssetView extends Asset {
  url?: string;
  styling?: string;
}

export interface Folio {
  id: number;
  authorId: string;
  folioName: string;
  parentFolioId?: number | null;
}

export interface FolioLister {
  id: number;
  folioName: string;
  level: number;
}

export interface Placement {
  id: number;
  authorId: string;
  folioId: number;
  assetId: number;
  caption: string;
}

export interface PlacementCaptions {
  placementId: string;
  extendedCaption?: string;
  char2Caption?: string;
}

export interface PlacementView extends Placement {
  assetView: AssetView;
  extendedCaptions?: PlacementCaptions[];
}

export interface FolioView extends Folio {
  placementViews: PlacementView[];
  level: number;
}

export interface Pitch {
  id: number;
  folioId: number;
  name: string;
  description: string;
  opens: Date;
  closes: Date;
  authorId: string;
}

export interface Slate {
  id: number;
  authorId: string;
  pitchId: number;
  isTopSlate: boolean;
}

export interface SlateMember {
  id: number;
  slateId: number;
  placementId: number;
  rankOrder: number;
}

export interface SlateMemberView extends SlateMember {
  placementView: PlacementView;
}

export interface SlateView extends Slate {
  slateMemberViews: SlateMemberView[];
}

export interface PitchView extends Pitch {
  slateId: number;
  slateView: SlateView;
}

export interface AssetImporter {
  folioName: string;
  caption: string;
  mediaType: string;
  sourceId: string;
}
export interface FolioImporter {
  folioName: string;
  parentFolioName: string;
}

export interface DataImporter {
  author: Author;
  folios: FolioImporter[];
  assets: AssetImporter[];
}

export enum AssetType {
  None = 'None',
  Folio = 'Folio',
  Placement = 'Placement',
  Pitch = 'Pitch',
}
