package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/lib/validator"
)

func deleteCmt(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	cmtID := validator.MustGetIDFromDict(params, "id")
	hostID := validator.MustGetIDFromDict(params, "hostID")
	hostType := validator.MustGetIntFromDict(params, "hostType")
	cmtTA, err := getCmtTA(hostType)
	app.PanicIfErr(err)
	err = cmtTA.DeleteCmt(app.DB, cmtID, uid, hostID)
	app.PanicIfErr(err)
	resp.MustComplete(nil)
}
