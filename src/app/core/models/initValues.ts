import { Asset, AssetView, Placement, PlacementView, Folio, FolioView, Author, AuthorView, Contest, ContestView, SlateView } from './interfaces';

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
  authorId: 'xxxx-xxxx',
  mediaType: 'Caption',
  sourceId: 'Caption',
};

export const assetViewInit: AssetView = {
  id: 0,
  authorId: '1',
  mediaType: '1',
  sourceId: '',
  url: '',
  paddingBottom: '',
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

export const slateViewInit: SlateView = {
  id: 0,
  contestId: 0,
  authorId: '',
  slateMemberViews: [],
  isTopSlate: false,
};

export const contestInit: Contest = {
  id: 0,
  authorId: '',
  opens: new Date('1922-01-03'),
  closes: new Date('1922-01-04'),
  contestTitle: '',
  contestDescription: '',
};
export const contestViewInit: ContestView = {
  id: 0,
  authorId: '',
  opens: new Date('1922-01-03'),
  closes: new Date('1922-01-04'),
  contestTitle: '',
  contestDescription: '',
  slateId: 0,
  slate: slateViewInit,
};
