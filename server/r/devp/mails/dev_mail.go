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
	"qing/a/appConfig"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/a/servicex/mailx/devmail"
	"qing/da"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

func getDevLatestMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxGenericString)
	index := jsonx.GetIntOrDefault(params, "index")

	devMail, err := devmail.GetLatestMail(email, index)
	appcm.PanicOn(err)
	return resp.MustComplete(devMail)
}

func getDevMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxGenericString)
	id := clib.MustGetStringFromDict(params, "id", appDef.LenMaxGenericString)

	devMail, err := devmail.GetMail(email, id)
	appcm.PanicOn(err)
	return resp.MustComplete(devMail)
}

func sendRealMail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	ac := appConfig.Get(r)

	params := resp.Params()
	to := clib.MustGetStringFromDict(params, "to", appDef.LenMaxGenericString)
	title := clib.MustGetStringFromDict(params, "title", appDef.LenMaxGenericString)
	content := clib.MustGetTextFromDict(params, "content")

	err := appService.Get().Mail.SendMail(ac, to, title, content, true, "QING_TEST")
	appcm.PanicOn(err)
	return resp.MustComplete(nil)
}

func eraseUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxGenericString)

	err := devmail.EraseUser(email)
	appcm.PanicOn(err)
	return resp.MustComplete(nil)
}

func eraseUserByID(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	id := clib.MustGetIDFromDict(params, "id")

	db := appDB.Get().DB()
	email, err := da.User.SelectEmail(db, id)
	if err == sql.ErrNoRows {
		return resp.MustComplete(nil)
	}
	appcm.PanicOn(err)
	err = devmail.EraseUser(email)
	appcm.PanicOn(err)
	return resp.MustComplete(nil)
}

func users(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	users, err := devmail.ListUsers()
	appcm.PanicOn(err)
	return resp.MustComplete(users)
}

func inbox(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxGenericString)

	mails, err := devmail.ListMails(email)
	appcm.PanicOn(err)
	return resp.MustComplete(mails)
}
