package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/da"
	"qing/lib/validator"
)

func deleteCmt(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	pid := validator.MustGetIDFromDict(params, "id")
	err := da.Cmt.DeleteCmt(app.DB, pid, uid)
	app.PanicIfErr(err)
	resp.MustComplete(nil)
}
