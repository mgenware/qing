/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package pub

import (
	"qing/app/handler"
	"qing/app/middleware"
	authapi "qing/r/api/pub/auth_api"
	cmtapi "qing/r/api/pub/cmt_api"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(middleware.ParseJSONMiddleware)

	Router.Mount("/cmt", cmtapi.Router)
	Router.Mount("/auth", authapi.Router)
}
