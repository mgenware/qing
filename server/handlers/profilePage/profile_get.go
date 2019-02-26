package profilePage

import (
	"net/http"
	"qing/app"
	"qing/da"
	"qing/handlers/system"

	"github.com/go-chi/chi"
)

var vUserPage = app.TemplateManager.MustParseLocalizedView("/profile/profile.html")

func ProfileGET(w http.ResponseWriter, r *http.Request) {
	uid, err := app.URL.DecodeID(chi.URLParam(r, "uid"))
	if err != nil {
		system.NotFoundHandler(w, r)
		return
	}
	user, err := da.User.SelectUserProfile(app.DB, uid)
	resp := app.HTMLResponse(w, r)
	if err != nil {
		resp.MustFail(err)
		return
	}

	title := user.Name
	userData := NewProfileDataFromUser(user)
	d := app.MasterPageData(title, vUserPage.MustExecuteToString(resp.Lang(), userData))
	d.AppName = "profile"
	resp.MustComplete(d)
}
