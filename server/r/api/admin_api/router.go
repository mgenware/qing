/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"qing/app"
	"qing/app/handler"
	"qing/app/middleware"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(app.UserManager.RequireLoginJSONMiddleware)
	Router.Core.Use(app.UserManager.UnsafeRequireAdminMiddlewareJSON)
	Router.Core.Use(middleware.ParseJSONMiddleware)

	Router.Post("/set-admin", setAdmin)
	Router.Post("/get-admins", getAdmins)
}
