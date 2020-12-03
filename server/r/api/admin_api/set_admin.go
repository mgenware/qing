package adminapi

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func setAdmin(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	targetUserID := validator.MustGetIDFromDict(params, "target_user_id")
	value := validator.MustGetIntFromDict(params, "value")

	err := da.User.UnsafeUpdateAdmin(app.DB, targetUserID, value == 1)
	if err != nil {
		panic(err)
	}
	return resp.MustComplete(nil)
}
