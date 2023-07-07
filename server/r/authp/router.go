/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authp

import (
	"qing/a/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

const authLSKey = "auth"

func init() {
	Router.Get("/verify-reg-email/{key}", verifyRegEmailPage)
	Router.Get("/reset-pwd/{key}", resetPwdPage)
	Router.Get("/*", defaultPage)
}
