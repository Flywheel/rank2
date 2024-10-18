import {
  Asset,
  AssetView,
  Placement,
  PlacementView,
  Folio,
  FolioView,
  Author,
  AuthorView,
  Pitch,
  PitchView,
  SlateView,
  SlateMember,
  Slate,
  SlateMemberView,
} from './interfaces';

export const authorInit: Author = {
  id: '',
  name: '',
};

export const authorViewInit: AuthorView = {
  id: '',
  name: '',
  authorFolio: {
    id: 0,
    authorId: '',
    folioName: '',
    placementViews: [],
  },
};

export const assetInit: Asset = {
  id: 1,
  authorId: '',
  mediaType: 'Caption',
  sourceId: '',
};

export const assetViewInit: AssetView = {
  id: 0,
  authorId: '1',
  mediaType: '1',
  sourceId: '',
  url: '',
  styling: '',
};

export const placementInit: Placement = {
  id: 0,
  authorId: '',
  assetId: 0,
  folioId: 0,
  caption: '',
};

export const placementViewInit: PlacementView = {
  id: 0,
  authorId: '',
  assetId: 0,
  folioId: 0,
  caption: '',
  asset: assetViewInit,
};

export const folioInit: Folio = {
  id: 0,
  authorId: '',
  folioName: '',
};

export const folioViewInit: FolioView = {
  id: 0,
  authorId: '',
  folioName: '',
  placementViews: [],
};

export const slateInit: Slate = {
  id: 0,
  authorId: '',
  contestId: 0,
  isTopSlate: false,
};

export const slateMemberInit: SlateMember = {
  id: 0,
  authorId: '',
  slateId: 0,
  placementId: 0,
  rankOrder: 0,
};

export const slateMemberViewInit: SlateMemberView = {
  id: 0,
  authorId: '',
  slateId: 0,
  placementId: 0,
  rankOrder: 0,
  placementView: placementViewInit,
};

export const slateViewInit: SlateView = {
  id: 0,
  contestId: 0,
  authorId: '',
  slateMemberViews: [],
  isTopSlate: false,
};

export const pitchInit: Pitch = {
  id: 0,
  authorId: '',
  folioId: 0,
  opens: new Date('1922-01-03'),
  closes: new Date('1922-01-04'),
  title: '',
  description: '',
};
export const contestViewInit: PitchView = {
  id: 0,
  authorId: '',
  folioId: 0,
  opens: new Date('1922-01-03'),
  closes: new Date('1922-01-04'),
  title: '',
  description: '',
  slateId: 0,
  slateView: slateViewInit,
};
