/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"
	"qing/a/app"
	"qing/a/appHandler"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/a/servicex/mailx"
	"qing/lib/clib"
)

func getDevMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := app.ContextDict(r)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxGenericString)

	devMail, err := mailx.GetDevMail(email, 0)
	app.PanicOn(err)
	return resp.MustComplete(devMail)
}
