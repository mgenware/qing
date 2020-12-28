package fgmodapi

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func getInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	id := validator.MustGetIDFromDict(params, "id")

	db := app.DB
	res, err := da.ForumGroup.SelectInfoForEditing(db, id)
	app.PanicIfErr(err)
	return resp.MustComplete(res)
}
