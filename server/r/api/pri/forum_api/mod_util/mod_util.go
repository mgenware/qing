package modutil

import (
	"net/http"
	"qing/app"
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
	return da.ForumGroupMod.IsMod(app.DB, groupID, uid)
}

func hasPermOnForum(forumID, uid uint64) (bool, error) {
	return da.ForumMod.IsMod(app.DB, forumID, uid)
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
func GetRequestForumGroupPermLevel(r *http.Request, groupID uint64) (int, error) {
	sUser := app.ContextUser(r)
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
func GetRequestForumPermLevel(r *http.Request, forumID uint64) (int, error) {
	sUser := app.ContextUser(r)
	if sUser == nil {
		return 0, nil
	}
	if sUser.Admin {
		return PermLevelRoot, nil
	}
	uid := sUser.ID
	groupID, err := da.Forum.SelectGroupID(app.DB, forumID)
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

	hasForumPerm, err := da.ForumPerm.HasPerm(app.DB, forumID, uid)
	if err != nil {
		return 0, err
	}
	if hasForumPerm {
		return PermLevelForum, nil
	}
	return 0, nil
}
