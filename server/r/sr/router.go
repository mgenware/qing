package sr

import (
	"qing/app"
	"qing/app/middleware"
	"qing/r/sr/compose"
	"qing/r/sr/settings"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Use(app.UserManager.EnsureLoggedInMWJSON)
	Router.Use(middleware.ParseJSONRequest)

	Router.Mount("/compose", compose.Router)
	Router.Mount("/settings", settings.Router)
}
