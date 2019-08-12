package mp

import (
	"net/http"
	"qing/app"

	"github.com/go-chi/chi"
)

var Router = chi.NewRouter()

func init() {
	Router.Use(app.UserManager.EnsureLoggedInMWHTML)
	Router.Get("/*", genericGET)
}

func genericGET(w http.ResponseWriter, r *http.Request) {
	resp := app.HTMLResponse(w, r)

	content := "<m-app></m-app>"
	// Page title will be set in frontend
	d := app.MasterPageData("", content)
	d.Scripts = app.TemplateManager.AssetsManager.JS.Dashboard

	resp.MustComplete(d)
}
