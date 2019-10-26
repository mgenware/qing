package pri

import (
	"qing/app"
	"qing/app/middleware"
	captchaapi "qing/r/api/pri/captcha_api"
	composeapi "qing/r/api/pri/compose_api"
	profileapi "qing/r/api/pri/profile_api"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Use(app.UserManager.EnsureLoggedInMWJSON)
	Router.Use(middleware.ParseJSONRequest)

	Router.Mount("/compose", composeapi.Router)
	Router.Mount("/profile", profileapi.Router)
	Router.Get("/req-capt", captchaapi.CaptchaGET)
}
