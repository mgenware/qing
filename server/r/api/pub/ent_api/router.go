/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package entapi

import (
	"qing/a/handler"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/cmts", cmts)
	Router.Post("/cmt", getCmt)
}
