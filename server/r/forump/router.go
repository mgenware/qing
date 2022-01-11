/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import (
	"qing/a/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

func init() {
	// Authentication is performed at backend API level.
	Router.Get("/{fid}/settings", getForumSettings)
	Router.Get("/{fid}", getForum)
}
