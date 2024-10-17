export const theData = {
  folios: [
    {
      folioName: 'Aimspoll',
      parentFolioName: '',
    },
    {
      folioName: 'Border Integrity',
      parentFolioName: 'Aimspoll',
    },
    {
      folioName: 'Minimum Wage',
      parentFolioName: 'Aimspoll',
    },
    {
      folioName: 'Oscars 2024',
      parentFolioName: '',
    },
  ],
  assets: [
    {
      folioName: 'Oscars 2024',
      mediaType: 'youtube',
      caption: 'American Fiction',
      sourceId: 'i0MbLCpYJPA',
    },
    {
      folioName: 'Oscars 2024',
      mediaType: 'youtube',
      caption: 'Barbie',
      sourceId: 'pBk4NYhWNMM',
    },
    { folioName: 'Border Integrity', mediaType: 'Caption', caption: 'Facts', sourceId: '' },
    { folioName: 'Border Integrity', mediaType: 'Caption', caption: 'Values', sourceId: '' },
    { folioName: 'Border Integrity', mediaType: 'Caption', caption: 'Propositions', sourceId: '' },
  ],
};

// treeData: TreeNode[] = [
//   {
//     name: 'Root',
//     children: [
//       { name: 'Child 1' },
//       {
//         name: 'Child 2',
//         children: [
//           { name: 'Grandchild 1' },

//           { name: 'Grandchild 2', children: [{ name: 'Great Grandchild1' }, { name: 'Great Grandchild 2' }] },
//           { name: 'Grandchild 3' },
//         ],
//       },
//     ],
//   },
// ];

export const initialAssetPlacementData = [
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

// add folio with assets to folio folioName: '@miniherald'
// then make pitch
export const dp = [
  { mediaType: 'folio', sourceId: '', caption: 'US President 2024' },
  { mediaType: 'youtube', sourceId: 'sHky_Xopyrw', caption: 'Kamala Harris' },
  { mediaType: 'youtube', sourceId: 'URG4bYES91E', caption: 'Robert Kennedy, Jr.' },
  { mediaType: 'youtube', sourceId: 'V3n8qmgNHZc', caption: 'Chase Oliver' },
  { mediaType: 'youtube', sourceId: '2KsIxLn7UO0', caption: 'Jill Stein' },
];
