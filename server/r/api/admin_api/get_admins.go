package adminapi

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/r/rcom"
)

func getAdmins(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	admins, err := da.User.UnsafeSelectAdmins(app.DB)
	if err != nil {
		panic(err)
	}
	userModels := make([]rcom.UserInfo, len(admins))
	for i, user := range admins {
		userModels[i] = rcom.NewUserInfo(user.ID, user.Name, user.IconName)
	}
	return resp.MustComplete(userModels)
}
