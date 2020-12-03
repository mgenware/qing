package userapi

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"

	"github.com/mgenware/go-packagex/v5/jsonx"
)

func findUsers(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	byID := jsonx.GetIntOrDefault(params, "byID")
	var err error
	var users []*da.FindUserResult
	if byID != 0 {
		id := validator.MustGetIDFromDict(params, "value")
		user, err := da.User.FindUserByID(app.DB, id)
		app.PanicIfErr(err)
		users = append(users, user)
	} else {
		name := validator.MustGetStringFromDict(params, "value", defs.Constants.MaxUserNameLen)
		users, err = da.User.FindUsersByName(app.DB, name)
		app.PanicIfErr(err)
	}
	userModels := make([]*rcom.UserInfo, len(users))
	for _, user := range users {
		userModels = append(userModels, rcom.NewUserInfo(user.ID, user.Name, user.IconName))
	}
	return resp.MustComplete(userModels)
}
