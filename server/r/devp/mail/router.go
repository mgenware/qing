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
	Router.Post("/get", getDevMail)
	Router.Post("/get-latest", getDevLatestMail)
	Router.Post("/send-real", sendRealMail)
	Router.Post("/send-dev", sendDevMail)
	Router.Post("/erase-user", eraseUser)
	Router.Post("/erase-user-by-id", eraseUserByID)
	Router.Post("/users", users)
	Router.Post("/inbox", inbox)
}
