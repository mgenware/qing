package sr

import (
	"qing/app"
	"qing/app/middleware"
	"qing/r/sr/composeAPI"
	"qing/r/sr/profileAPI"
	"qing/r/sr/captchaAPI"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Use(app.UserManager.EnsureLoggedInMWJSON)
	Router.Use(middleware.ParseJSONRequest)

	Router.Mount("/compose", composeAPI.Router)
	Router.Mount("/profile", profileAPI.Router)
	Router.Get("/req-capt", captchaAPI.captchaGET)
}
