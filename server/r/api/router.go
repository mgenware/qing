/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package api

import (
	"qing/app/handler"
	adminapi "qing/r/api/admin_api"
	"qing/r/api/pri"
	"qing/r/api/pub"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Mount("/pub", pub.Router)
	Router.Mount("/pri", pri.Router)
	Router.Mount("/admin", adminapi.Router)
}
