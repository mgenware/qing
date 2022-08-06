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
	"qing/a/appService"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/a/servicex/mailx"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

func getDevMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := app.ContextDict(r)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxGenericString)
	idx := jsonx.GetInt(params, "idx")

	devMail, err := mailx.GetDevMail(email, idx)
	app.PanicOn(err)
	return resp.MustComplete(devMail)
}

func sendMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := app.ContextDict(r)
	to := clib.MustGetStringFromDict(params, "to", appdef.LenMaxGenericString)
	title := clib.MustGetStringFromDict(params, "title", appdef.LenMaxGenericString)
	content := clib.MustGetTextFromDict(params, "content")

	_, err := appService.Get().MailService.Send(to, title, content)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}
