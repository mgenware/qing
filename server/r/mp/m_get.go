package mp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

func init() {
	Router.Core.Use(app.UserManager.EnsureLoggedInMWHTML)
	Router.Get("/*", genericGET)
}

func genericGET(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	content := "<dashboard-app></dashboard-app>"
	// Page title will be set on frontend side
	d := app.MasterPageData("", content)
	d.Scripts = app.TemplateManager.AssetsManager.JS.Dashboard

	return resp.MustComplete(d)
}
