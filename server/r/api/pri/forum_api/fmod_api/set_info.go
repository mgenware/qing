package fmodapi

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"

	"github.com/mgenware/go-packagex/jsonx"
)

func setInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	id := validator.MustGetIDFromDict(params, "id")
	name := validator.MustGetStringFromDict(params, "name", defs.DB.MaxNameLen)
	desc := jsonx.GetStringOrDefault(params, "desc")

	db := app.DB
	err := da.Forum.UpdateInfo(db, id, name, desc)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
