/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authapi

import "qing/a/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/signup", signUpAPI)
	Router.Post("/signin", signInAPI)
	Router.Post("/reset-pwd-request", resetPwdRequestAPI)
	Router.Post("/reset-pwd-complete", resetPwdCompleteAPI)
}
