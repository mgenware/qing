package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func getPostSource(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	pid := validator.MustGetIDFromDict(params, "id")
	res, err := da.Post.SelectPostSource(app.DB, pid, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(res)
}
