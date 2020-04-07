package authapi

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
)

func signOut(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	err := app.UserManager.SessionManager.Logout(w, r)
	if err != nil {
		return resp.MustFail(err)
	}
	return resp.MustComplete(nil)
}
