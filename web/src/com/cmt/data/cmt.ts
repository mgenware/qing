/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

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
  // `CmtData` -> HasLiked *uint64 `json:"hasLiked,omitempty"`
  hasLiked?: boolean;

  // Reply only properties.
  toUserName?: string;
  toUserURL?: string;

  // UI properties.
  uiHighlighted?: boolean;
}

export interface CmtCountChangedEventDetail {
  // The number of items after change.
  count: number;
  // The number of changed items.
  offset: number;
}

export function isCmtReply(cmt: Cmt): boolean {
  return !!cmt.toUserURL;
}
