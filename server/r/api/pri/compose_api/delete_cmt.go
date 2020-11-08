package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/lib/validator"

	"github.com/mgenware/go-packagex/v5/jsonx"
)

func deleteCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	id := validator.MustGetIDFromDict(params, "id")
	hostType := validator.MustGetIntFromDict(params, "hostType")
	isReply := jsonx.GetIntOrDefault(params, "isReply")

	cmtTA, err := getCmtTA(hostType)
	app.PanicIfErr(err)
	if isReply == 0 {
		err = cmtTA.DeleteCmt(app.DB, id, uid)
	} else {
		err = cmtTA.DeleteReply(app.DB, id, uid)
	}
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
