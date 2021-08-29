/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/set-post", setEntity)
	Router.Post("/delete-post", deleteEntity)
	Router.Post("/get-entity-src", getEntitySrc)
	Router.Post("/set-cmt", setCmt)
	Router.Post("/delete-cmt", deleteCmt)
}
