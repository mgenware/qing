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

	content := "<div id=\"m_app\"></div>"
	// Page title will be set in frontend
	d := app.MasterPageData("", content)

	resp.MustComplete(d)
}
