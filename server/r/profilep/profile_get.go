package profilep

import (
	"net/http"
	"qing/app"
	"qing/da"
	"qing/r/sysh"

	"github.com/go-chi/chi"
)

var vUserPage = app.TemplateManager.MustParseLocalizedView("/profile/profile.html")

func ProfileGET(w http.ResponseWriter, r *http.Request) {
	uid, err := app.URL.DecodeID(chi.URLParam(r, "uid"))
	if err != nil {
		sysh.NotFoundHandler(w, r)
		return
	}
	user, err := da.User.SelectProfile(app.DB, uid)
	resp := app.HTMLResponse(w, r)
	if err != nil {
		resp.MustFail(err)
		return
	}

	title := user.Name
	userData := NewProfileDataFromUser(user)
	d := app.MasterPageData(title, vUserPage.MustExecuteToString(resp.Lang(), userData))
	resp.MustComplete(d)
}
