package fgmodapi

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func setForumGroupMod(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := app.ContextUserID(r)

	targetUserID := validator.MustGetIDFromDict(params, "target_user_id")
	value := validator.MustGetIntFromDict(params, "value")

	if uid == targetUserID {
		panic("You cannot change moderator status of your own account")
	}
	err := da.User.UnsafeUpdateAdmin(app.DB, targetUserID, value == 1)

	if err != nil {
		panic(err)
	}
	return resp.MustComplete(nil)
}
