package mp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

func init() {
	Router.Core.Use(app.UserManager.RequireLoginHTMLMiddleware)
	Router.Get("/*", defaultHandler)
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := app.MainPageData("", "")
	d.Scripts = app.MainPageManager.AssetsManager.JS.M

	return resp.MustComplete(d)
}
