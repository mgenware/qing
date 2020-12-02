package pri

import (
	"qing/app"
	"qing/app/handler"
	"qing/app/middleware"
	authapi "qing/r/api/pri/auth_api"
	captchaapi "qing/r/api/pri/captcha_api"
	composeapi "qing/r/api/pri/compose_api"
	likeapi "qing/r/api/pri/like_api"
	mpapi "qing/r/api/pri/mp_api"
	profileapi "qing/r/api/pri/profile_api"
	userapi "qing/r/api/pri/user_api"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(app.UserManager.RequireLoginMiddlewareJSON)
	Router.Core.Use(middleware.ParseJSONRequest)

	Router.Mount("/compose", composeapi.Router)
	Router.Mount("/profile", profileapi.Router)
	Router.Mount("/auth", authapi.Router)
	Router.Mount("/like", likeapi.Router)
	Router.Mount("/mp", mpapi.Router)
	Router.Mount("/user", userapi.Router)
	Router.Core.Get("/req-capt", captchaapi.ReqCaptcha)
}
