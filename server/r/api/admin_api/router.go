/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"qing/a/appUserManager"
	"qing/a/handler"
	"qing/a/middleware"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(appUserManager.Get().RequireLoginJSONMiddleware)
	Router.Core.Use(appUserManager.Get().UnsafeRequireAdminMiddlewareJSON)
	Router.Core.Use(middleware.ParseJSON)

	Router.Post("/set-admin", setAdmin)
	Router.Post("/admins", getAdmins)
	Router.Post("/site-settings", getSiteSettings)
	Router.Post("/update-site-settings", updateSiteSettings)
}
