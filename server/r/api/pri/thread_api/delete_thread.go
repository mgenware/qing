package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func deleteThread(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	id := validator.MustGetIDFromDict(params, "id")
	err := da.Thread.DeleteItem(app.DB, id, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(app.URL.UserProfile(uid))
}
