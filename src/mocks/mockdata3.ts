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

// Utility function to generate incremental IDs
let authorIdCounter = 1;
const generateAuthorId = () => authorIdCounter++;

let folioIdCounter = 1;
const generateFolioId = () => folioIdCounter++;

let assetIdCounter = 1;
const generateAssetId = () => assetIdCounter++;

let placementIdCounter = 1;
const generatePlacementId = () => placementIdCounter++;

let contestIdCounter = 1;
const generateContestId = () => contestIdCounter++;

let slateIdCounter = 1;
const generateSlateId = () => slateIdCounter++;

let slateMemberIdCounter = 1;
const generateSlateMemberId = () => slateMemberIdCounter++;

// **Authors**
export const authorList: Author[] = [{ id: generateAuthorId(), name: 'miniherald', authenticatorId: 'miniherald', eventLog: [] }];

// **Folios**
const foliosData = [
  { isDefault: true, folioName: '@miniherald' },
  { isDefault: false, folioName: 'Presidential Candidates 2024' },
  { isDefault: false, folioName: 'AimsPoll' },
];

export const folioList: Folio[] = foliosData.map(data => ({
  id: generateFolioId(),
  authorId: authorList[0].id,
  ...data,
}));

// **Assets**
const assetsMap: Record<string, Asset> = {};
export const assets: Asset[] = [];
const getAssetId = (mediaType: string, sourceId: string) => {
  const key = `${mediaType}-${sourceId}`;
  if (!assetsMap[key]) {
    const asset: Asset = {
      id: generateAssetId(),
      authorId: authorList[0].id,
      mediaType,
      sourceId,
    };
    assets.push(asset);
    assetsMap[key] = asset;
  }
  return assetsMap[key].id;
};

// **Placements**
const placementsData = [
  { mediaType: 'folio', sourceId: '', caption: 'US President 2024', folioTopic: '@miniherald' },
  { mediaType: 'folio', sourceId: '', caption: 'AimsPoll', folioTopic: '@miniherald' },
  { mediaType: 'youtube', sourceId: 'sHky_Xopyrw', caption: 'Kamala Harris', folioTopic: 'Presidential Candidates 2024' },
  { mediaType: 'youtube', sourceId: 'URG4bYES91E', caption: 'Robert Kennedy, Jr.', folioTopic: 'Presidential Candidates 2024' },
  { mediaType: 'youtube', sourceId: 'V3n8qmgNHZc', caption: 'Chase Oliver', folioTopic: 'Presidential Candidates 2024' },
  { mediaType: 'youtube', sourceId: '2KsIxLn7UO0', caption: 'Jill Stein', folioTopic: 'Presidential Candidates 2024' },
  { mediaType: 'youtube', sourceId: 't3J0iRz35jc', caption: 'Randall Terry', folioTopic: 'Presidential Candidates 2024' },
  { mediaType: 'folio', sourceId: '', caption: 'Border Integrity', folioTopic: 'AimsPoll 2024' },
  { mediaType: 'folio', sourceId: '', caption: 'Budget Control', folioTopic: 'AimsPoll 2024' },
  { mediaType: 'folio', sourceId: '', caption: 'Foreign Policy', folioTopic: 'AimsPoll 2024' },
  { mediaType: 'folio', sourceId: '', caption: 'Reproductive Health', folioTopic: 'AimsPoll 2024' },
  { mediaType: 'folio', sourceId: '', caption: 'Gun Plague', folioTopic: 'AimsPoll 2024' },
  { mediaType: 'folio', sourceId: '', caption: 'Minimum Wage', folioTopic: 'AimsPoll 2024' },
];

export const placementList: Placement[] = placementsData.map(data => {
  const folio = folioList.find(f => f.folioName === data.folioTopic);
  return {
    id: generatePlacementId(),
    authorId: authorList[0].id,
    assetId: getAssetId(data.mediaType, data.sourceId),
    folioId: folio ? folio.id : 0,
    caption: data.caption,
  };
});

// **Placement Views**
export const placementViewList: PlacementView[] = placementList.map(placement => ({
  ...placement,
  asset: assets.find(asset => asset.id === placement.assetId)!,
}));

// **Folio Views**
export const folioViewList: FolioView[] = folioList.map(folio => {
  const placements = placementViewList.filter(placement => placement.folioId === folio.id);
  return {
    ...folio,
    placements,
  };
});

// **Contests**
const contestsData = [
  { contestTitle: '@miniherald', contestDescription: '@miniherald' },
  { contestTitle: 'US President 2024', contestDescription: 'Candidate for President of the United States' },
  { contestTitle: 'AimsPoll 2024', contestDescription: 'Top Issues for the 2024 Election' },
];

export const contestList: Contest[] = contestsData.map(data => ({
  id: generateContestId(),
  authorId: authorList[0].id,
  opens: new Date('2024-01-01'),
  closes: new Date('2024-11-01'),
  ...data,
}));

// **Slates**
export const slateList: Slate[] = contestList.map((contest, index) => ({
  id: generateSlateId(),
  authorId: contest.authorId,
  contestId: contest.id,
  isTopSlate: index === 0, // First contest has top slate
}));

// **Slate Members**
const slateMembersMapping: Record<string, string[]> = {
  'US President 2024': ['Kamala Harris', 'Robert Kennedy, Jr.', 'Chase Oliver', 'Jill Stein', 'Randall Terry'],
  'AimsPoll 2024': ['Border Integrity', 'Budget Control', 'Foreign Policy', 'Reproductive Health', 'Gun Plague', 'Minimum Wage'],
  '@miniherald': ['US President 2024', 'AimsPoll'],
};

export const slateMembers: SlateMember[] = [];

Object.entries(slateMembersMapping).forEach(([contestTitle, placementCaptions]) => {
  const contest = contestList.find(c => c.contestTitle === contestTitle);
  const slate = slateList.find(s => s.contestId === contest?.id);
  placementCaptions.forEach((caption, index) => {
    const placement = placementList.find(p => p.caption === caption);
    const slateMember: SlateMember = {
      id: generateSlateMemberId(),
      authorId: authorList[0].id,
      slateId: slate?.id ?? 0,
      placementId: placement?.id ?? 0,
      rankOrder: index + 1,
    };
    slateMembers.push(slateMember);
  });
});

// **Slate Member Views**
export const slateMemberViewList: SlateMemberView[] = slateMembers.map(member => {
  const placementView = placementViewList.find(pv => pv.id === member.placementId);
  return {
    ...member,
    placementView: placementView!,
  };
});

// **Slate Views**
export const slateListView: SlateView[] = slateList.map(slate => {
  const slateMemberViews = slateMemberViewList.filter(memberView => memberView.slateId === slate.id);
  return {
    ...slate,
    slateMemberViews,
  };
});

// **Contest Views**
export const contestViewList: ContestView[] = contestList.map(contest => {
  const slate = slateListView.find(s => s.contestId === contest.id);
  return {
    ...contest,
    slateId: slate?.id ?? 0,
    slate: slate!,
  };
});
