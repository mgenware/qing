/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fgmodapi

import (
	"net/http"
	"qing/app"
	"qing/app/appcom"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func setForumGroupMod(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := app.ContextUserID(r)
	groupID := appcom.ContextForumGroupID(r.Context())
	db := app.DB
	var err error

	if groupID == 0 {
		panic("Unexpected empty group ID in setForumGroupMod")
	}

	targetUserID := validator.MustGetIDFromDict(params, "target_user_id")
	value := validator.MustGetIntFromDict(params, "value")

	if uid == targetUserID {
		panic("You cannot change moderator status of your own account")
	}

	if value == 1 {
		// When a user becomes a forum group mod, all its sub-forums mod status
		// of this group is cleared.
		forumIDs, err := da.Forum.SelectForumIDsForGroup(db, groupID)
		app.PanicIfErr(err)

		_, err = da.ForumMod.DeleteUserFromForumMods(db, targetUserID, forumIDs)
		app.PanicIfErr(err)

		err = da.ForumGroupMod.InsertMod(db, groupID, targetUserID)
		app.PanicIfErr(err)
	} else {
		err = da.ForumGroupMod.DeleteMod(db, groupID, targetUserID)
		app.PanicIfErr(err)
	}
	return resp.MustComplete(nil)
}
