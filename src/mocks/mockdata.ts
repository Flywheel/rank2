import { Asset, Author, Folio, Placement, Contest, SlateMemberView, ContestView, SlateView } from '../app/core/interfaces/interfaces';

export const authorList: Author[] = [
  {
    id: 1,
    name: 'miniherald',
    authenticatorId: 'miniherald',
    folioId: 1,
    eventLog: [],
  },
];

export const folios: Folio[] = [
  { id: 1, authorId: 1, name: 'miniherald' },
  { id: 2, authorId: 1, name: 'Dem VP 2024' },
];

export const assets: Asset[] = [
  {
    id: 1,
    authorId: 1,
    mediaType: 'image',
    sourceId: '1',
  },
  {
    id: 2,
    authorId: 1,
    mediaType: 'image',
    sourceId: '2',
  },
  {
    id: 3,
    authorId: 1,
    mediaType: 'image',
    sourceId: '3',
  },
  {
    id: 4,
    authorId: 1,
    mediaType: 'image',
    sourceId: '4',
  },
];

export const slateMembers: SlateMemberView[] = [
  {
    id: 1,
    slateId: 1,
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
    slateId: 1,
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
    slateId: 1,
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
    slateId: 1,
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
    slateId: 1,
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
    slateId: 2,
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
    slateId: 2,
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
    slateId: 2,
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
    slateId: 2,
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

export const contestList: Contest[] = [
  {
    id: 1,
    authorId: 1,
    contestTitle: 'US President 2024',
    contestDescription: 'Candidate for President of the United States',
    topSlateId: 1,
    opens: new Date('2024-01-01'),
    closes: new Date('2024-11-01'),
  },
  {
    id: 2,
    authorId: 1,
    contestTitle: 'AimsPoll 2024',
    contestDescription: 'Top Issues for the 2024 Election',
    topSlateId: 2,
    opens: new Date('2024-01-01'),
    closes: new Date('2024-11-01'),
  },
];

export const contestViewList: ContestView[] = contestList.map(contest => {
  const slateMemberViews = slateMembers.filter(member => member.slateId === contest.topSlateId);
  const slate: SlateView = {
    id: contest.topSlateId,
    contestId: contest.id,
    authorId: contest.authorId,
    slateMemberViews: slateMemberViews,
  };
  return {
    id: contest.id,
    authorId: contest.authorId,
    opens: contest.opens,
    closes: contest.closes,
    topSlateId: contest.topSlateId,
    contestTitle: contest.contestTitle,
    contestDescription: contest.contestDescription,
    slate: slate,
  };
});

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
