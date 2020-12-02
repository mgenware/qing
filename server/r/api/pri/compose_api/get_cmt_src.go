package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func getCmtSource(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	pid := validator.MustGetIDFromDict(params, "id")
	res, err := da.Cmt.SelectCmtSource(app.DB, pid, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(res)
}
