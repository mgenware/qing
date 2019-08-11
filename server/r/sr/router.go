package sr

import (
	"qing/app"
	"qing/app/middleware"
	"qing/r/sr/compose"
	"qing/r/sr/profileService"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Use(app.UserManager.EnsureLoggedInMWJSON)
	Router.Use(middleware.ParseJSONRequest)

	Router.Mount("/compose", compose.Router)
	Router.Mount("/profile", profileService.Router)
	Router.Get("/req-capt", captchaGET.captchaGET)
}
