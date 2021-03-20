export default interface Cmt {
  id: string;
  title: string;
  createdAt: string;
  modifiedAt: string;
  // Might not be updated in <cmt-app>, which uses `cmtCollector.totalCount` instead.
  replyCount: number;
  contentHTML: string;
  userID: string;
  userName: string;
  userURL: string;
  userIconURL: string;
  likes: number;

  // Reply only properties.
  toUserID?: string;
  toUserName?: string;
  toUserURL?: string;
}

export interface CmtCountChangedEventDetail {
  // The number of items after change.
  count: number;
  // The number of changed items.
  offset: number;
}

export function isCmtReply(cmt: Cmt): boolean {
  return !!cmt.toUserID;
}
