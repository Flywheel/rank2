import { Asset, Author, Folio, Placement, Contest, SlateMemberView, ContestView, SlateView, PlacementView, Slate } from '../app/core/interfaces/interfaces';

export const authorList: Author[] = [
  {
    id: 1,
    name: 'miniherald',
    authenticatorId: 'miniherald',
    eventLog: [],
  },
];

export const folioList: Folio[] = [
  {
    id: 1,
    authorId: 1,
    isDefault: true,
    name: '@miniherald',
  },
  {
    id: 2,
    authorId: 1,
    isDefault: false,
    name: 'Presidential Candidates 2024',
  },
  {
    id: 2,
    authorId: 1,
    isDefault: false,
    name: 'AimsPoll 2024',
  },
];

export const assets: Asset[] = [
  {
    id: 1,
    authorId: 1,
    mediaType: 'NoMedia',
    sourceId: '1',
  },
];

export const authorDefaultPlacement: Placement = {
  id: 1,
  authorId: 1,
  assetId: 1,
  folioId: folioList.find(folio => folio.isDefault)?.id ?? 0,
  caption: folioList.find(folio => folio.isDefault)?.name ?? 'default',
};

const authorDefaultPlacementView: PlacementView = {
  id: 1,
  authorId: 1,
  assetId: 1,
  folioId: folioList.find(folio => folio.isDefault)?.id ?? 0,
  caption: folioList.find(folio => folio.isDefault)?.name ?? 'default',
  asset: assets.find(asset => asset.id === 1) ?? assets[0],
};

const commonProperties = {
  authorId: 1,
  assetId: 1,
};

const placementsData = [
  { caption: 'Kamala Harris', folioId: 2 },
  { caption: 'Robert Kennedy, Jr.', folioId: 2 },
  { caption: 'Chase Oliver', folioId: 2 },
  { caption: 'Jill Stein', folioId: 2 },
  { caption: 'Randall Terry', folioId: 2 },
  { caption: 'Border Integrity', folioId: 3 },
  { caption: 'Budget Control', folioId: 3 },
  { caption: 'Foreign Policy', folioId: 3 },
  { caption: 'Reproductive Health', folioId: 3 },
  { caption: 'Gun Plague', folioId: 3 },
  { caption: 'Minimum Wage', folioId: 3 },
];

// Generate the placementList by mapping over placementsData
export const placementList: Placement[] = placementsData.map((data, index) => ({
  id: index + 2,
  ...commonProperties,
  folioId: data.folioId,
  caption: data.caption,
}));

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
export { placementViewList };

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
  {
    id: 1,
    authorId: 1,
    contestId: 1,
    isTopSlate: true,
  },
  {
    id: 2,
    authorId: 1,
    contestId: 2,
    isTopSlate: false,
  },
  {
    id: 3,
    authorId: 1,
    contestId: 3,
    isTopSlate: false,
  },
];

export const slateListView: SlateView[] = slateList.map(slate => {
  // const slateMemberViews = slateMembers.filter(member => member.authorId === 1 && member.slateId === slate.id);
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

export const slateMembers: SlateMemberView[] = [
  {
    id: 1,
    slateId: 2,
    authorId: 1,
    placementId: 1,
    rankOrder: 1,
    placementView: {
      id: 1,
      authorId: 1,
      folioId: 1,
      caption: 'Kamala Harris',
      assetId: 1,
      asset: {
        id: 1,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: 'sHky_Xopyrw',
      },
    },
  },
  {
    id: 2,
    slateId: 2,
    authorId: 1,
    placementId: 2,
    rankOrder: 2,
    placementView: {
      id: 2,
      authorId: 1,
      folioId: 1,
      caption: 'Robert Kennedy, Jr.',
      assetId: 2,
      asset: {
        id: 2,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: 'URG4bYES91E',
      },
    },
  },
  {
    id: 3,
    slateId: 2,
    authorId: 1,
    placementId: 3,
    rankOrder: 3,
    placementView: {
      id: 3,
      authorId: 1,
      folioId: 1,
      caption: 'Chase Oliver',
      assetId: 3,
      asset: {
        id: 3,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: 'V3n8qmgNHZc',
      },
    },
  },
  {
    id: 4,
    slateId: 2,
    authorId: 1,
    placementId: 4,
    rankOrder: 4,
    placementView: {
      id: 4,
      authorId: 1,
      folioId: 1,
      caption: 'Jill Stein',
      assetId: 4,
      asset: {
        id: 4,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: '2KsIxLn7UO0',
      },
    },
  },
  {
    id: 5,
    slateId: 2,
    authorId: 1,
    placementId: 5,
    rankOrder: 5,
    placementView: {
      id: 5,
      authorId: 1,
      folioId: 1,
      caption: 'Randall Terry',
      assetId: 5,
      asset: {
        id: 5,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: 't3J0iRz35jc',
      },
    },
  },
  {
    id: 6,
    slateId: 3,
    authorId: 1,
    placementId: 6,
    rankOrder: 1,
    placementView: {
      id: 6,
      authorId: 1,
      folioId: 2,
      caption: 'Border Integrity',
      assetId: 1,
      asset: {
        id: 1,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: 'sHky_Xopyrw',
      },
    },
  },
  {
    id: 7,
    slateId: 3,
    authorId: 1,
    placementId: 7,
    rankOrder: 2,
    placementView: {
      id: 7,
      authorId: 1,
      folioId: 2,
      caption: 'Healthcare for All',
      assetId: 2,
      asset: {
        id: 2,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: 'URG4bYES91E',
      },
    },
  },
  {
    id: 8,
    slateId: 3,
    authorId: 1,
    placementId: 8,
    rankOrder: 3,
    placementView: {
      id: 8,
      authorId: 1,
      folioId: 2,
      caption: 'Foreign Policy',
      assetId: 3,
      asset: {
        id: 3,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: 'V3n8qmgNHZc',
      },
    },
  },
  {
    id: 9,
    slateId: 3,
    authorId: 1,
    placementId: 9,
    rankOrder: 4,
    placementView: {
      id: 9,
      authorId: 1,
      folioId: 2,
      caption: 'Minimum Wage',
      assetId: 4,
      asset: {
        id: 4,
        authorId: 1,
        mediaType: 'youtube',
        sourceId: '2KsIxLn7UO0',
      },
    },
  },
];

export const contestViewList: ContestView[] = contestViews.map(contest => {
  const slateMemberViews = slateMembers.filter(member => member.authorId === contest.authorId && member.slateId === contest.id);
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

// export const contestViewList2: ContestView[] = contestList.map(contest => {
//   const slateMemberViews = slateMembers.filter(member => member.authorId === contest.authorId && member.slateId === contest.id);
//   const slate: SlateView = {
//     id: slateMemberViews[0].slateId,
//     contestId: contest.id,
//     authorId: contest.authorId,
//     slateMemberViews: slateMemberViews,
//     isTopSlate: true,
//   };
//   return {
//     id: contest.id,
//     authorId: contest.authorId,
//     opens: contest.opens,
//     closes: contest.closes,
//     topSlateId: contest.id,
//     contestTitle: contest.contestTitle,
//     contestDescription: contest.contestDescription,
//     slateId: slate.id,
//     slate: slate,
//   };
// });

//populateContestViews() {
// this.contestViews = this.contestData.map(contest => {
//   const slateMemberViews = this.USPresident24.filter(member => member.contestId === contest.id);
//   const slate: SlateView = {
//     id: contest.topSlateId,
//     contestId: contest.id,
//     authorId: contest.authorId,
//     slateMemberViews: slateMemberViews,
//   };
//   return {
//     id: contest.id,
//     authorId: contest.authorId,
//     opens: contest.opens,
//     closes: contest.closes,
//     topSlateId: contest.topSlateId,
//     contestTitle: contest.contestTitle,
//     contestDescription: contest.contestDescription,
//     slate: slate,
//   };
// });
//}
