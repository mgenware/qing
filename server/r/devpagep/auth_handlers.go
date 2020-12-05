package devpagep

import (
	"net/http"

	"qing/app"
	"qing/app/handler"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v5/strconvx"
)

func signIn(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	uid, err := strconvx.ParseUint64(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)

	user, err := app.UserManager.CreateUserSessionFromUID(uid)
	app.PanicIfErr(err)

	err = app.UserManager.SessionManager.Login(w, r, user)
	app.PanicIfErr(err)

	return resp.Redirect("/", http.StatusTemporaryRedirect)
}

func signOut(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	err := app.UserManager.SessionManager.Logout(w, r)
	app.PanicIfErr(err)

	return resp.Redirect("/", http.StatusTemporaryRedirect)
}
