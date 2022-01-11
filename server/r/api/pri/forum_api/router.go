/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forumapi

import (
	"qing/a/handler"
	fgmodapi "qing/r/api/pri/forum_api/fgmod_api"
	fmodapi "qing/r/api/pri/forum_api/fmod_api"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Mount("/fgmod", fgmodapi.Router)
	Router.Mount("/fmod", fmodapi.Router)
}
