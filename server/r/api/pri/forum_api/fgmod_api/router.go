/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fgmodapi

import "qing/a/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(RequireGroupModeJSONMiddleware)

	Router.Post("/set-info", setInfoAPI)
	Router.Post("/info", getInfoAPI)
}
