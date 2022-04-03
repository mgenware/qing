/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

 /******************************************************************************************
  * Do not edit this file manually.
  * Automatically generated via `qing sod thread/threadWind`.
  * See `lib/dev/sod/objects/thread/threadWind.yaml` for details.
  ******************************************************************************************/

package threadSod

type ThreadWind struct {
	ThreadID string  `json:"threadID,omitempty"`
	ForumID  *string `json:"forumID,omitempty"`
}

func NewThreadWind(threadID string, forumID *string) ThreadWind {
	return ThreadWind{
		ThreadID: threadID,
		ForumID: forumID,
	}
}
