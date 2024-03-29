/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import "qing/a/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/set-entity", setEntityAPI)
	Router.Post("/del-entity", delEntityAPI)
	Router.Post("/entity-src", entitySrcAPI)
	Router.Post("/set-cmt", setCmtAPI)
	Router.Post("/del-cmt", delCmtAPI)
}
