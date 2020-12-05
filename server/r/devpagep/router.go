package devpagep

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
)

var Router = handler.NewHTMLRouter()

func init() {
	// Auth router.
	authRouter := handler.NewHTMLRouter()
	authRouter.Get("/in/{uid}", signIn)
	authRouter.Get("/out", signOut)
	// We have to define a fallback handler for each router.
	authRouter.Get("/*", defaultHandler)
	Router.Mount("/auth", authRouter)

	Router.Get("/*", defaultHandler)
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := app.MasterPageData("", "")
	d.Scripts = app.MasterPageManager.AssetsManager.JS.DevPage

	return resp.MustComplete(d)
}
