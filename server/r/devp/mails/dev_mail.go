/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mails

import (
	"net/http"
	"qing/a/app"
	"qing/a/appService"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/a/servicex/mailx/devmail"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

func getDevLastMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxGenericString)
	last := jsonx.GetInt(params, "last")

	devMail, err := devmail.GetLastMail(email, last)
	app.PanicOn(err)
	return resp.MustComplete(devMail)
}

func getDevMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxGenericString)
	dirName := jsonx.GetString(params, "dirName")

	devMail, err := devmail.GetMail(email, dirName)
	app.PanicOn(err)
	return resp.MustComplete(devMail)
}

func sendMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	to := clib.MustGetStringFromDict(params, "to", appdef.LenMaxGenericString)
	title := clib.MustGetStringFromDict(params, "title", appdef.LenMaxGenericString)
	content := clib.MustGetTextFromDict(params, "content")

	_, err := appService.Get().Mail.Send(to, title, content)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}

func eraseUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxGenericString)

	err := devmail.EraseUser(email)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}

func users(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	users, err := devmail.ListUsers()
	app.PanicOn(err)
	return resp.MustComplete(users)
}

func inbox(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxGenericString)

	mails, err := devmail.ListMails(email)
	app.PanicOn(err)
	return resp.MustComplete(mails)
}
