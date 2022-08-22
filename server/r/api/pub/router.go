/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package pub

import (
	"qing/a/handler"
	"qing/a/middleware"
	authapi "qing/r/api/pub/auth_api"
	entapi "qing/r/api/pub/ent_api"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(middleware.APIMiddleware)

	Router.Mount("/ent", entapi.Router)
	Router.Mount("/auth", authapi.Router)
}
