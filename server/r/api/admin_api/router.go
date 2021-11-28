/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"qing/app/appUserManager"
	"qing/app/handler"
	"qing/app/middleware"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(appUserManager.Get().RequireLoginJSONMiddleware)
	Router.Core.Use(appUserManager.Get().UnsafeRequireAdminMiddlewareJSON)
	Router.Core.Use(middleware.ParseJSON)

	Router.Post("/set-admin", setAdmin)
	Router.Post("/get-admins", getAdmins)
	Router.Post("/get-site-settings", getAdmins)
	Router.Post("/update-site-settings", updateSiteSettings)
}
