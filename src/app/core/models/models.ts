export interface Asset {
  id: string;
  mediaType: string;
  sourceId: string;
}
export interface AssetView extends Asset {
  url: string;
  paddingBottom: string;
}

export interface Contest {
  id: number;
  contestTitle: string;
  contestDescription: string;
  opens: Date;
  closes: Date;
  authorId: number;
  topSlateId: number;
}

export interface Slate {
  id: number;
  authorId: number;
  contestId: number;
}

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
  channelId: number;
  eventLog: EventLog[];
}

export interface Channel {
  id: number;
  authorId: number;
  name: string;
}

export interface ChannelMember {
  id: number;
  caption: string;
  channelId: number;
  authorId: number;
  assetId: string;
}

export interface Candidate {
  id: number;
  authorId: number;
  channelId: number;
  label: string;
  assetId: number;
}

export interface CandidateView extends Candidate {
  asset: AssetView;
}

export interface SlateMember {
  id: number;
  authorId: number;
  slateId: number;
  candidateId: number;
  rankOrder: number;
}

export interface SlateMemberView extends SlateMember {
  candidateView: CandidateView;
}

export interface SlateView extends Slate {
  slateMemberViews: SlateMemberView[];
}

export interface ContestView extends Contest {
  slate: SlateView;
}
