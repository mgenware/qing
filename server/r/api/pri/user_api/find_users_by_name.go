package userapi

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func findUsersByName(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	name := validator.MustGetStringFromDict(params, "name", defs.Constants.MaxUserNameLen)
	users, err := da.User.FindUsersByName(app.DB, name)
	if err != nil {
		return resp.MustFail(err)
	}
	return resp.MustComplete(users)
}
