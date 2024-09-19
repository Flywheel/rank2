import {
  Asset,
  Author,
  Folio,
  Placement,
  Contest,
  SlateMemberView,
  ContestView,
  SlateView,
  PlacementView,
  Slate,
  SlateMember,
  FolioView,
} from '../app/core/interfaces/interfaces';

export const authorList: Author[] = [{ id: 1, name: 'miniherald', authenticatorId: 'miniherald', eventLog: [] }];

export const folioList: Folio[] = [
  { id: 1, authorId: 1, isDefault: true, folioTopic: '@miniherald' },
  { id: 2, authorId: 1, isDefault: false, folioTopic: 'Presidential Candidates 2024' },
  { id: 3, authorId: 1, isDefault: false, folioTopic: 'AimsPoll 2024' },
];

export const assets: Asset[] = [{ id: 1, authorId: 1, mediaType: 'NoMedia', sourceId: '1' }];

export const authorDefaultPlacement: Placement = {
  id: 1,
  authorId: 1,
  assetId: 1,
  folioId: folioList.find(folio => folio.isDefault)?.id ?? 0,
  caption: folioList.find(folio => folio.isDefault)?.folioTopic ?? 'default',
};

const authorDefaultPlacementView: PlacementView = {
  id: 1,
  authorId: 1,
  assetId: 1,
  folioId: folioList.find(folio => folio.isDefault)?.id ?? 0,
  caption: folioList.find(folio => folio.isDefault)?.folioTopic ?? 'default',
  asset: assets.find(asset => asset.id === 1) ?? assets[0],
};

const commonProperties = {
  authorId: 1,
  assetId: 1,
};

const placementsData = [
  { id: 8, mediaType: 'folio', sourceId: '', caption: 'US President 2024', folioId: 1 },
  { id: 9, mediaType: 'folio', sourceId: '', caption: 'AimsPoll', folioId: 1 },
  { id: 11, mediaType: 'youtube', sourceId: 'sHky_Xopyrw', caption: 'Kamala Harris', folioId: 2 },
  { id: 12, mediaType: 'youtube', sourceId: 'URG4bYES91E', caption: 'Robert Kennedy, Jr.', folioId: 2 },
  { id: 13, mediaType: 'youtube', sourceId: 'V3n8qmgNHZc', caption: 'Chase Oliver', folioId: 2 },
  { id: 14, mediaType: 'youtube', sourceId: '2KsIxLn7UO0', caption: 'Jill Stein', folioId: 2 },
  { id: 15, mediaType: 'youtube', sourceId: 't3J0iRz35jc', caption: 'Randall Terry', folioId: 2 },
  { id: 16, mediaType: 'folio', sourceId: '...........', caption: 'Border Integrity', folioId: 3 },
  { id: 17, mediaType: 'folio', sourceId: '...........', caption: 'Budget Control', folioId: 3 },
  { id: 18, mediaType: 'folio', sourceId: '...........', caption: 'Foreign Policy', folioId: 3 },
  { id: 19, mediaType: 'folio', sourceId: '...........', caption: 'Reproductive Health', folioId: 3 },
  { id: 20, mediaType: 'folio', sourceId: '...........', caption: 'Gun Plague', folioId: 3 },
  { id: 21, mediaType: 'folio', sourceId: '...........', caption: 'Minimum Wage', folioId: 3 },
];

// Generate the placementList by mapping over placementsData
const placementList: Placement[] = placementsData.map(data => ({
  id: data.id,
  ...commonProperties,
  folioId: data.folioId,
  caption: data.caption,
}));

placementList.unshift(authorDefaultPlacement);
export { placementList };

const placementViewList: PlacementView[] = placementList.map(placement => {
  return {
    id: placement.id,
    authorId: placement.authorId,
    folioId: placement.folioId,
    caption: placement.caption,
    assetId: placement.assetId,
    asset: assets.find(asset => asset.id === placement.assetId) ?? assets[0],
  };
});
placementViewList.unshift(authorDefaultPlacementView);

const folioViewList: FolioView[] = folioList.map(folio => {
  const placementViews = placementViewList.filter(placement => placement.folioId === folio.id);
  return {
    ...folio,
    placements: placementViews,
  };
});

export { placementViewList, folioViewList };

export const contestList: Contest[] = [
  {
    id: 1,
    authorId: 1,
    contestTitle: '@miniherald',
    contestDescription: 'Top Issues for the 2024 Election',
    opens: new Date('2024-01-01'),
    closes: new Date('2024-11-01'),
  },
  {
    id: 2,
    authorId: 1,
    contestTitle: 'US President 2024',
    contestDescription: 'Candidate for President of the United States',
    opens: new Date('2024-01-01'),
    closes: new Date('2024-11-01'),
  },
  {
    id: 3,
    authorId: 1,
    contestTitle: 'AimsPoll 2024',
    contestDescription: 'Top Issues for the 2024 Election',
    opens: new Date('2024-01-01'),
    closes: new Date('2024-11-01'),
  },
];

export const slateList: Slate[] = [
  { id: 1, authorId: 1, contestId: 1, isTopSlate: true },
  { id: 2, authorId: 1, contestId: 2, isTopSlate: false },
  { id: 3, authorId: 1, contestId: 3, isTopSlate: false },
];

export const slateListView: SlateView[] = slateList.map(slate => {
  return {
    id: slate.id,
    contestId: slate.contestId,
    authorId: slate.authorId,
    slateMemberViews: [],
    isTopSlate: slate.isTopSlate,
  };
});

export const contestViews: ContestView[] = contestList.map(contest => {
  const slate = slateList.find(s => s.contestId === contest.id);
  return {
    ...contest,
    slateId: slate ? slate.id : 0,
    slate: slateListView.find(s => s.id === (slate ? slate.id : 0)) ?? slateListView[0],
  };
});

const slateMembersData: SlateMember[] = [
  { id: 0, authorId: 1, slateId: 1, placementId: 8, rankOrder: 1 },
  { id: 0, authorId: 1, slateId: 1, placementId: 9, rankOrder: 2 },
  { id: 0, authorId: 1, slateId: 2, placementId: 11, rankOrder: 1 },
  { id: 0, authorId: 1, slateId: 2, placementId: 12, rankOrder: 2 },
  { id: 0, authorId: 1, slateId: 2, placementId: 13, rankOrder: 3 },
  { id: 0, authorId: 1, slateId: 2, placementId: 14, rankOrder: 4 },
  { id: 0, authorId: 1, slateId: 2, placementId: 15, rankOrder: 5 },
  { id: 0, authorId: 1, slateId: 3, placementId: 16, rankOrder: 1 },
  { id: 0, authorId: 1, slateId: 3, placementId: 17, rankOrder: 2 },
  { id: 0, authorId: 1, slateId: 3, placementId: 18, rankOrder: 3 },
  { id: 0, authorId: 1, slateId: 3, placementId: 19, rankOrder: 4 },
  { id: 0, authorId: 1, slateId: 3, placementId: 20, rankOrder: 5 },
  { id: 0, authorId: 1, slateId: 3, placementId: 21, rankOrder: 6 },
];

export const slateMembers: SlateMemberView[] = slateMembersData.map(data => {
  return {
    id: data.id,
    slateId: data.slateId,
    authorId: 1,
    placementId: data.placementId,
    rankOrder: data.rankOrder,
    placementView: placementViewList.find(placementView => placementView.id === data.placementId) ?? placementViewList[0],
  };
});

export const contestViewList: ContestView[] = contestViews.map(contest => {
  const slateMemberViews = slateMembers.filter(member => member.slateId === contest.slateId);
  const slate: SlateView = {
    id: contest.slateId,
    contestId: contest.id,
    authorId: contest.authorId,
    slateMemberViews: slateMemberViews,
    isTopSlate: true,
  };
  return {
    id: contest.id,
    authorId: contest.authorId,
    opens: contest.opens,
    closes: contest.closes,
    topSlateId: contest.id,
    contestTitle: contest.contestTitle,
    contestDescription: contest.contestDescription,
    slateId: slate.id,
    slate: slate,
  };
});
