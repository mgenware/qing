package authapi

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/r/rcom"
)

func getAdmins(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	admins, err := da.User.UnsafeSelectAdmins()
	if err != nil {
		panic(err)
	}
	userModels := make([]*rcom.UserInfo, len(admins))
	for _, user := range admins {
		userModels = append(userModels, rcom.NewUserInfo(user.ID, user.Name, user.IconName))
	}
	return resp.MustComplete(userModels)
}
