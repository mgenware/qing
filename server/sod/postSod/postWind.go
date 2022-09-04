/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * Do not edit this file manually.
 * Automatically generated via `qing sod post/postWind`.
 * See `lib/dev/sod/objects/post/postWind.yaml` for details.
 ******************************************************************************************/

package postSod

type PostWind struct {
	ID              string `json:"id,omitempty"`
	CmtCount        uint   `json:"cmtCount,omitempty"`
	InitialLikes    uint   `json:"initialLikes,omitempty"`
	InitialHasLiked bool   `json:"initialHasLiked,omitempty"`
	IsThread        bool   `json:"isThread,omitempty"`
	ForumID         string `json:"forumID,omitempty"`
}

func NewPostWind(id string, cmtCount uint, initialLikes uint, initialHasLiked bool, isThread bool, forumID string) PostWind {
	return PostWind{
		ID: id,
		CmtCount: cmtCount,
		InitialLikes: initialLikes,
		InitialHasLiked: initialHasLiked,
		IsThread: isThread,
		ForumID: forumID,
	}
}
