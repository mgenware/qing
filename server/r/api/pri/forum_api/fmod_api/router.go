/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fmodapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(RequireForumModeJSONMiddleware)

	Router.Post("/set-info", setInfo)
	Router.Post("/get-info", getInfo)
}
