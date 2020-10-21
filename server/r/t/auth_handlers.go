package t

import (
	"encoding/json"
	"fmt"
	"net/http"
	"qing/app/cm"

	"qing/app"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v5/strconvx"
)

func signIn(w http.ResponseWriter, r *http.Request) {
	uid, err := strconvx.ParseUint64(chi.URLParam(r, "uid"))
	if err != nil {
		fmt.Fprintln(w, "Invalid user ID")
		return
	}

	user, err := app.UserManager.CreateUserSessionFromUID(uid)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	err = app.UserManager.SessionManager.Login(w, r, user)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

func signOut(w http.ResponseWriter, r *http.Request) {
	err := app.UserManager.SessionManager.Logout(w, r)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	fmt.Fprintln(w, "Log out successfully")
}

func userInfo(w http.ResponseWriter, r *http.Request) {
	user := cm.ContextUser(r.Context())
	if user == nil {
		fmt.Fprintln(w, "No user currently logged in")
	} else {
		json, err := json.Marshal(user)
		if err != nil {
			fmt.Fprintf(w, "Error serializing user object, \"%v\"", err.Error())
		} else {
			fmt.Fprintln(w, string(json))
		}
	}
}
