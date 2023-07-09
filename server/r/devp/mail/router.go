/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mail

import (
	"qing/a/handler"
)

var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/get", getDevMailAPI)
	Router.Post("/get-latest", getDevLatestMailAPI)
	Router.Post("/send-real", sendRealMailAPI)
	Router.Post("/send-dev", sendDevMailAPI)
	Router.Post("/erase-user", eraseUserAPI)
	Router.Post("/erase-user-by-id", eraseUserByIDAPI)
	Router.Post("/users", usersAPI)
	Router.Post("/inbox", inboxAPI)
}
