/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mails

import (
	"database/sql"
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appService"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/a/servicex/mailx/devmail"
	"qing/da"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

func getDevLatestMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxGenericString)
	index := jsonx.GetInt(params, "index")

	devMail, err := devmail.GetLatestMail(email, index)
	app.PanicOn(err)
	return resp.MustComplete(devMail)
}

func getDevMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxGenericString)
	id := clib.MustGetStringFromDict(params, "id", appdef.LenMaxGenericString)

	devMail, err := devmail.GetMail(email, id)
	app.PanicOn(err)
	return resp.MustComplete(devMail)
}

func sendRealMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	to := clib.MustGetStringFromDict(params, "to", appdef.LenMaxGenericString)
	title := clib.MustGetStringFromDict(params, "title", appdef.LenMaxGenericString)
	content := clib.MustGetTextFromDict(params, "content")

	err := appService.Get().Mail.SendMail(to, title, content, true)
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

func eraseUserByID(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	params := app.ContextDict(r)
	id := clib.MustGetIDFromDict(params, "id")

	db := appDB.Get().DB()
	email, err := da.User.SelectEmail(db, id)
	if err == sql.ErrNoRows {
		return resp.MustComplete(nil)
	}
	app.PanicOn(err)
	err = devmail.EraseUser(email)
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
