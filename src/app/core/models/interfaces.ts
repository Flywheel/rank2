export interface EventLog {
  id: number;
  authorId: string;
  eventText: string;
  eventDate: Date;
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
}

export interface Asset {
  id: number;
  authorId: string;
  mediaType: string;
  sourceId: string;
}

export interface AssetView extends Asset {
  url: string;
  styling?: string;
}

export interface Folio {
  id: number;
  authorId: string;
  folioName: string;
  parentFolioId?: number | null;
}

export interface Placement {
  id: number;
  authorId: string;
  folioId: number;
  assetId: number;
  caption: string;
}

export interface PlacementView extends Placement {
  asset: AssetView;
}

export interface FolioView extends Folio {
  placementViews: PlacementView[];
}

export interface Contest {
  id: number;
  contestTitle: string;
  contestDescription: string;
  opens: Date;
  closes: Date;
  authorId: string;
}

export interface Slate {
  id: number;
  authorId: string;
  contestId: number;
  isTopSlate: boolean;
}

export interface SlateMember {
  id: number;
  authorId: string;
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

export interface ContestView extends Contest {
  slateId: number;
  slate: SlateView;
}
