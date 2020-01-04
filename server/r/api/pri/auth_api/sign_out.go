package authapi

import (
	"net/http"
	"qing/app"
)

func signOut(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	err := app.UserManager.SessionManager.Logout(w, r)
	if err != nil {
		resp.MustFail(err)
		return
	}
	resp.MustComplete(nil)
}
