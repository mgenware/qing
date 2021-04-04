/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package pri

import (
	"qing/app/appUserManager"
	"qing/app/handler"
	"qing/app/middleware"
	authapi "qing/r/api/pri/auth_api"
	captchaapi "qing/r/api/pri/captcha_api"
	composeapi "qing/r/api/pri/compose_api"
	forumapi "qing/r/api/pri/forum_api"
	likeapi "qing/r/api/pri/like_api"
	mpapi "qing/r/api/pri/mp_api"
	profileapi "qing/r/api/pri/profile_api"
	userapi "qing/r/api/pri/user_api"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(appUserManager.Get().RequireLoginJSONMiddleware)
	Router.Core.Use(middleware.ParseJSONMiddleware)

	Router.Mount("/compose", composeapi.Router)
	Router.Mount("/profile", profileapi.Router)
	Router.Mount("/auth", authapi.Router)
	Router.Mount("/like", likeapi.Router)
	Router.Mount("/mp", mpapi.Router)
	Router.Mount("/user", userapi.Router)
	Router.Mount("/forum", forumapi.Router)
	Router.Core.Get("/req-capt", captchaapi.ReqCaptcha)
}
