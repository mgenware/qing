/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mails

import (
	"qing/a/handler"
)

var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/get", getDevMail)
	Router.Post("/get-latest", getDevLatestMail)
	Router.Post("/send", sendMail)
	Router.Post("/erase-user", eraseUser)
	Router.Post("/users", users)
	Router.Post("/inbox", inbox)
}
