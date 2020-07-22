package pri

import (
	"qing/app"
	"qing/app/handler"
	"qing/app/middleware"
	authapi "qing/r/api/pri/auth_api"
	captchaapi "qing/r/api/pri/captcha_api"
	composeapi "qing/r/api/pri/compose_api"
	likeapi "qing/r/api/pri/like_api"
	profileapi "qing/r/api/pri/profile_api"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(app.UserManager.EnsureLoggedInMWJSON)
	Router.Core.Use(middleware.ParseJSONRequest)

	Router.Mount("/compose", composeapi.Router)
	Router.Mount("/profile", profileapi.Router)
	Router.Mount("/auth", authapi.Router)
	Router.Mount("/like", likeapi.Router)
	Router.Core.Get("/req-capt", captchaapi.ReqCaptcha)
}
