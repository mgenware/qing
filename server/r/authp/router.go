package authp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

func init() {
	Router.Get("/verify-reg-email/{key}", verifyRegEmail)
	Router.Get("/*", genericGET)
}

func genericGET(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	content := "<auth-app></auth-app>"
	// Page title will be set on frontend side
	d := app.MasterPageData("", content)
	d.Scripts = app.MasterPageManager.AssetsManager.JS.Auth

	return resp.MustComplete(d)
}
