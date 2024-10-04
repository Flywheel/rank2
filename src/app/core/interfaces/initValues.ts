import { Asset, AssetView, Placement, PlacementView, Folio, FolioView, Author, AuthorView } from './interfaces';

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
    isDefault: false,
    folioName: '',
    placementViews: [],
  },
};

export const assetInit: Asset = {
  id: 0,
  authorId: '',
  mediaType: '',
  sourceId: '',
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
  isDefault: false,
  folioName: '',
};

export const folioViewInit: FolioView = {
  id: 0,
  authorId: '',
  isDefault: false,
  folioName: '',
  placementViews: [],
};
