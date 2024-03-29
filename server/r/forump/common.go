/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import (
	"context"
)

func getForumEditableFromContext(ctx context.Context, forumID uint64) (bool, error) {
	var forumEditable bool
	// TODO: IsForumMod is removed from user session.
	// sUser := appcm.ContextUser(ctx)
	// if sUser != nil && sUser.IsForumMod {
	// 	// `GetRequestForumPermLevel` is time-consuming, we only do that when session
	// 	// user has `IsForumMod` set.
	// 	perm, err := modutil.GetRequestForumPermLevel(sUser, forumID)
	// 	if err != nil {
	// 		return false, err
	// 	}
	// 	forumEditable = perm >= modutil.PermLevelForum
	// }
	return forumEditable, nil
}
