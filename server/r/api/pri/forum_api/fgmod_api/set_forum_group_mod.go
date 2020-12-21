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
	}
	err := da.User.UnsafeUpdateAdmin(app.DB, targetUserID, value == 1)

	if err != nil {
		panic(err)
	}
	return resp.MustComplete(nil)
}
