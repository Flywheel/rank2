import {
  Asset,
  Author,
  Folio,
  Placement,
  Pitch,
  SlateMemberView,
  PitchView,
  SlateView,
  PlacementView,
  Slate,
  SlateMember,
  FolioView,
  AssetView,
} from '../app/core/models/interfaces';

// Utility functions to generate incremental IDs

const generateAuthorId = () => ''; //  authorIdCounter++;

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
export const authorList: Author[] = [{ id: generateAuthorId(), name: 'miniherald' }];

// **Folios**
const initialFolioData = [
  { isDefault: true, folioName: '@miniherald' },
  { isDefault: false, folioName: 'Presidential Candidates 2024' },
  { isDefault: false, folioName: 'AimsPoll' },
];

export const folioList: Folio[] = initialFolioData.map(data => ({
  id: generateFolioId(),
  authorId: authorList[0].id,
  ...data,
}));

// **Initial Data**
const initialAssetPlacementData = [
  { mediaType: 'folio', sourceId: '', caption: '@miniHerald', folioName: '@miniherald' },
  { mediaType: 'folio', sourceId: '', caption: 'US President 2024', folioName: '@miniherald' },
  { mediaType: 'folio', sourceId: '', caption: 'AimsPoll', folioName: '@miniherald' },
  { mediaType: 'youtube', sourceId: 'sHky_Xopyrw', caption: 'Kamala Harris', folioName: 'Presidential Candidates 2024' },
  { mediaType: 'youtube', sourceId: 'URG4bYES91E', caption: 'Robert Kennedy, Jr.', folioName: 'Presidential Candidates 2024' },
  { mediaType: 'youtube', sourceId: 'V3n8qmgNHZc', caption: 'Chase Oliver', folioName: 'Presidential Candidates 2024' },
  { mediaType: 'youtube', sourceId: '2KsIxLn7UO0', caption: 'Jill Stein', folioName: 'Presidential Candidates 2024' },
  { mediaType: 'youtube', sourceId: 't3J0iRz35jc', caption: 'Randall Terry', folioName: 'Presidential Candidates 2024' },
  { mediaType: 'folio', sourceId: '', caption: 'Border Integrity', folioName: 'AimsPoll' },
  { mediaType: 'folio', sourceId: '', caption: 'Budget Control', folioName: 'AimsPoll' },
  { mediaType: 'folio', sourceId: '', caption: 'Foreign Policy', folioName: 'AimsPoll' },
  { mediaType: 'folio', sourceId: '', caption: 'Reproductive Health', folioName: 'AimsPoll' },
  { mediaType: 'folio', sourceId: '', caption: 'Gun Plague', folioName: 'AimsPoll' },
  { mediaType: 'folio', sourceId: '', caption: 'Minimum Wage', folioName: 'AimsPoll' },
];

export const assetList: Asset[] = initialAssetPlacementData.map(data => ({
  id: generateAssetId(),
  authorId: authorList[0].id,
  mediaType: data.mediaType,
  sourceId: data.sourceId,
}));

export const assetViewList: AssetView[] = assetList.map(asset => ({
  ...asset,
  url: '',
  paddingBottom: '',
}));

export const placementList: Placement[] = initialAssetPlacementData.map((data, index) => {
  const folio = folioList.find(f => f.folioName === data.folioName);
  return {
    id: generatePlacementId(),
    authorId: authorList[0].id,
    assetId: assetList[index].id, // Corresponding asset ID
    folioId: folio ? folio.id : 0,
    caption: data.caption,
  };
});

export const placementViewList: PlacementView[] = placementList.map(placement => ({
  ...placement,
  assetView: assetViewList.find(asset => asset.id === placement.assetId)!,
}));

export const folioViewList: FolioView[] = folioList.map(folio => {
  const placementViews = placementViewList.filter(placement => placement.folioId === folio.id);
  return {
    ...folio,
    placementViews,
  };
});

const contestsData = [
  { title: '@miniherald', description: '@miniherald' },
  { title: 'US President 2024', description: 'Candidate for President of the United States' },
  { title: 'AimsPoll 2024', description: 'Top Issues for the 2024 Election' },
];

export const contestList: Pitch[] = contestsData.map(data => ({
  id: generateContestId(),
  folioId: folioList.find(f => f.folioName === data.title)?.id ?? 0,
  authorId: authorList[0].id,
  opens: new Date('2024-01-01'),
  closes: new Date('2024-11-01'),
  ...data,
}));

export const slateList: Slate[] = contestList.map((contest, index) => ({
  id: generateSlateId(),
  authorId: contest.authorId,
  pitchId: contest.id,
  isTopSlate: index === 0, // First contest has top slate
}));

const slateMembersMapping: Record<string, string[]> = {
  'US President 2024': ['Kamala Harris', 'Robert Kennedy, Jr.', 'Chase Oliver', 'Jill Stein', 'Randall Terry'],
  'AimsPoll 2024': ['Border Integrity', 'Budget Control', 'Foreign Policy', 'Reproductive Health', 'Gun Plague', 'Minimum Wage'],
  '@miniherald': ['US President 2024', 'AimsPoll'],
};

export const slateMemberList: SlateMember[] = [];

Object.entries(slateMembersMapping).forEach(([title, placementCaptions]) => {
  const contest = contestList.find(c => c.title === title);
  const slate = slateList.find(s => s.pitchId === contest?.id);
  placementCaptions.forEach((caption, index) => {
    const placement = placementList.find(p => p.caption === caption);
    const slateMember: SlateMember = {
      id: generateSlateMemberId(),
      authorId: authorList[0].id,
      slateId: slate?.id ?? 0,
      placementId: placement?.id ?? 0,
      rankOrder: index + 1,
    };
    slateMemberList.push(slateMember);
  });
});

export const slateMemberViewList: SlateMemberView[] = slateMemberList.map(member => {
  const placementView = placementViewList.find(pv => pv.id === member.placementId);
  return {
    ...member,
    placementView: placementView!,
  };
});

export const slateListView: SlateView[] = slateList.map(slate => {
  const slateMemberViews = slateMemberViewList.filter(memberView => memberView.slateId === slate.id);
  return {
    ...slate,
    slateMemberViews,
  };
});

export const contestViewList: PitchView[] = contestList.map(contest => {
  const slate = slateListView.find(s => s.pitchId === contest.id);
  return {
    ...contest,
    slateId: slate?.id ?? 0,
    slateView: slate!,
  };
});
