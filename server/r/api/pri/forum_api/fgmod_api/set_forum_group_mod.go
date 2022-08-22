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
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appcom"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func setForumGroupMod(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := app.ContextUserID(r)
	groupID := appcom.ContextForumGroupID(r.Context())
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
		app.PanicOn(err)

		_, err = da.ForumMod.DeleteUserFromForumMods(db, targetUserID, forumIDs)
		app.PanicOn(err)

		err = da.ForumGroupMod.InsertMod(db, groupID, targetUserID)
		app.PanicOn(err)
	} else {
		err = da.ForumGroupMod.DeleteMod(db, groupID, targetUserID)
		app.PanicOn(err)
	}
	return resp.MustComplete(nil)
}
