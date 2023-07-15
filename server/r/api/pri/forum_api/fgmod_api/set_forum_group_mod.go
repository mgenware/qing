/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fgmodapi

import (
	"fmt"
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func setForumGroupMod(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()
	groupID := appcm.ContextForumGroupID(r.Context())
	db := appDB.DB()
	var err error

	if groupID == 0 {
		panic(fmt.Errorf("unexpected empty group ID in setForumGroupMod"))
	}

	targetUserID := clib.MustGetIDFromDict(params, "target_user_id")
	value := clib.MustGetIntFromDict(params, "value")

	if uid == targetUserID {
		panic(fmt.Errorf("you cannot change moderator status of your own account"))
	}

	if value == 1 {
		// When a user becomes a forum group mod, all its sub-forums mod status
		// of this group is cleared.
		forumIDs, err := da.Forum.SelectForumIDsForGroup(db, groupID)
		appcm.PanicOn(err, "failed to select forum IDs for group")

		_, err = da.ForumMod.DeleteUserFromForumMods(db, targetUserID, forumIDs)
		appcm.PanicOn(err, "failed to delete user from forum mods")

		err = da.ForumGroupMod.InsertMod(db, groupID, targetUserID)
		appcm.PanicOn(err, "failed to insert forum group mod")
	} else {
		err = da.ForumGroupMod.DeleteMod(db, groupID, targetUserID)
		appcm.PanicOn(err, "failed to delete forum group mod")
	}
	return resp.MustComplete(nil)
}
