export interface EventLog {
  id: number;
  authorId: number;
  eventText: string;
  eventDate: Date;
}

export interface Author {
  id: number;
  name: string;
  authenticatorId: string;
  eventLog: EventLog[];
}

export interface Asset {
  id: number;
  authorId: number;
  mediaType: string;
  sourceId: string;
}

export interface AssetView extends Asset {
  url: string;
  paddingBottom: string;
}

export interface Folio {
  id: number;
  authorId: number;
  isDefault: boolean;
  name: string;
}

export interface Placement {
  id: number;
  authorId: number;
  folioId: number;
  assetId: number;
  caption: string;
}

export interface PlacementView extends Placement {
  asset: Asset;
}

export interface Contest {
  id: number;
  contestTitle: string;
  contestDescription: string;
  opens: Date;
  closes: Date;
  authorId: number;
}

export interface Slate {
  id: number;
  authorId: number;
  contestId: number;
  isTopSlate: boolean;
}

export interface SlateMember {
  id: number;
  authorId: number;
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
