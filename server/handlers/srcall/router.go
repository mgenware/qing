package srCall

import (
	"qing/app"
	"qing/app/middleware"
	"qing/handlers/srcall/settings"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Use(app.UserManager.EnsureLoggedInMWJSON)
	Router.Use(middleware.ParseJSONRequest)

	// Mount sub routers
	Router.Mount("/settings", settings.Router)
}
