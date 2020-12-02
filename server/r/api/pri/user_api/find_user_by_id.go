package userapi

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func findUserByID(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	id := validator.MustGetIDFromDict(params, "id")
	user, err := da.User.FindUserByID(app.DB, id)
	if err != nil {
		return resp.MustFail(err)
	}
	return resp.MustComplete(user)
}
