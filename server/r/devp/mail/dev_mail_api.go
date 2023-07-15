/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mail

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

func getDevLatestMailAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxGenericString)
	index := jsonx.GetIntOrDefault(params, "index")

	devMail, err := devmail.GetLatestMail(email, index)
	appcm.PanicOn(err, "failed to get dev mail")
	return resp.MustComplete(devMail)
}

func getDevMailAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxGenericString)
	id := clib.MustGetStringFromDict(params, "id", appDef.LenMaxGenericString)

	devMail, err := devmail.GetMail(email, id)
	appcm.PanicOn(err, "failed to get dev mail")
	return resp.MustComplete(devMail)
}

func sendMailAPICore(w http.ResponseWriter, r *http.Request, realMail bool) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	ac := appConfig.Get(r)

	params := resp.Params()
	to := clib.MustGetStringFromDict(params, "to", appDef.LenMaxGenericString)
	title := clib.MustGetStringFromDict(params, "title", appDef.LenMaxGenericString)
	content := clib.MustGetTextFromDict(params, "content")

	err := appService.Get().Mail.SendMail(ac, to, title, content, realMail, "QING_TEST")
	appcm.PanicOn(err, "failed to send mail")
	return resp.MustComplete(nil)
}

func sendRealMailAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	return sendMailAPICore(w, r, true)
}

func sendDevMailAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	return sendMailAPICore(w, r, false)
}

func eraseUserAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxGenericString)

	err := devmail.EraseUser(email)
	appcm.PanicOn(err, "failed to erase user")
	return resp.MustComplete(nil)
}

func eraseUserByIDAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	id := clib.MustGetIDFromDict(params, "id")

	db := appDB.Get().DB()
	email, err := da.User.SelectEmail(db, id)
	if err == sql.ErrNoRows {
		return resp.MustComplete(nil)
	}
	appcm.PanicOn(err, "failed to select email")
	err = devmail.EraseUser(email)
	appcm.PanicOn(err, "failed to erase user")
	return resp.MustComplete(nil)
}

func usersAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	users, err := devmail.ListUsers()
	appcm.PanicOn(err, "failed to list users")
	return resp.MustComplete(users)
}

func inboxAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	params := resp.Params()
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxGenericString)

	mails, err := devmail.ListMails(email)
	appcm.PanicOn(err, "failed to list mails")
	return resp.MustComplete(mails)
}
