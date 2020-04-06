package authp

import (
	"net/http"
	"qing/app"

	"github.com/go-chi/chi"
)

var Router = chi.NewRouter()

func init() {
	Router.Get("verify-reg-email/{key}", veirfyRegEmailGET)
	Router.Get("/*", genericGET)
}

func genericGET(w http.ResponseWriter, r *http.Request) {
	resp := app.HTMLResponse(w, r)

	content := "<auth-app></auth-app>"
	// Page title will be set on frontend side
	d := app.MasterPageData("", content)
	d.Scripts = app.TemplateManager.AssetsManager.JS.Auth

	resp.MustComplete(d)
}
