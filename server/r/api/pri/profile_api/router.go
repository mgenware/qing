/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import "qing/a/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/info", info)
	Router.Post("/set-info", setInfo)
	Router.Core.Post("/set-avatar", uploadAvatar)
}
