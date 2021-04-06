/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package modutil

import (
	"qing/app/appDB"
	"qing/app/appcom"
	"qing/da"
)

const (
	// PermLevelForum indicates the permission is applied on forum level.
	PermLevelForum = 1
	// PermLevelForumGroup indicates the permission is applied on forum group level.
	PermLevelForumGroup = 2
	// PermLevelRoot indicates the permission is applied on root level.
	PermLevelRoot = 3
)

func hasPermOnForumGroup(groupID, uid uint64) (bool, error) {
	return da.ForumGroupMod.SelectIsMod(appDB.DB(), groupID, uid)
}

func hasPermOnForum(forumID, uid uint64) (bool, error) {
	return da.ForumMod.SelectIsMod(appDB.DB(), forumID, uid)
}

func getForumGroupPermLevelCore(groupID, uid uint64) (int, error) {
	hasGroupPerm, err := hasPermOnForumGroup(groupID, uid)
	if err != nil {
		return 0, err
	}
	if hasGroupPerm {
		return PermLevelForumGroup, nil
	}
	return 0, nil
}

// GetRequestForumGroupPermLevel returns the forum group permission level
// associated with the specified user.
// It returns 0 if the user doesn't have any permission attached.
func GetRequestForumGroupPermLevel(sUser *appcom.SessionUser, groupID uint64) (int, error) {
	if sUser == nil {
		return 0, nil
	}
	if sUser.Admin {
		return PermLevelRoot, nil
	}
	uid := sUser.ID
	return getForumGroupPermLevelCore(groupID, uid)
}

// GetRequestForumPermLevel returns the forum permission level
// associated with the specified user.
// It returns 0 if the user doesn't have any permission attached.
func GetRequestForumPermLevel(sUser *appcom.SessionUser, forumID uint64) (int, error) {
	if sUser == nil {
		return 0, nil
	}
	if sUser.Admin {
		return PermLevelRoot, nil
	}
	uid := sUser.ID
	groupID, err := da.Forum.SelectGroupID(appDB.DB(), forumID)
	if err != nil {
		return 0, err
	}
	if groupID != nil {
		groupLevel, err := getForumGroupPermLevelCore(*groupID, uid)
		if err != nil {
			return 0, err
		}
		if groupLevel != 0 {
			return groupLevel, nil
		}
	}

	hasForumPerm, err := da.ForumMod.SelectIsMod(appDB.DB(), forumID, uid)
	if err != nil {
		return 0, err
	}
	if hasForumPerm {
		return PermLevelForum, nil
	}
	return 0, nil
}
