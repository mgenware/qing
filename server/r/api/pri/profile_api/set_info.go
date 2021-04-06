/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/app/appUserManager"
	"qing/app/handler"
	"qing/da"

	"github.com/mgenware/go-packagex/v6/jsonx"
)

type infoData struct {
	da.UserTableSelectEditingDataResult

	IconURL string `json:"iconURL"`
}

func newInfoData(u *da.UserTableSelectEditingDataResult) infoData {
	d := infoData{UserTableSelectEditingDataResult: *u}
	d.IconURL = appURL.Get().UserIconURL250(u.ID, u.IconName)
	return d
}

func getInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := resp.UserID()

	dbInfo, err := da.User.SelectEditingData(appDB.DB(), uid)
	if err != nil {
		return resp.MustFail(err)
	}

	data := newInfoData(&dbInfo)
	return resp.MustComplete(data)
}

func setInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	sUser := resp.User()
	uid := resp.UserID()

	nick := jsonx.GetStringOrDefault(params, "name")
	if nick == "" {
		panic("The argument `name` cannot be empty")
	}
	website := jsonx.GetStringOrDefault(params, "website")
	company := jsonx.GetStringOrDefault(params, "company")
	location := jsonx.GetStringOrDefault(params, "location")

	// Update DB
	err := da.User.UpdateProfile(appDB.DB(), uid, nick, website, company, location)
	if err != nil {
		return resp.MustFail(err)
	}
	// Update session
	sUser.Name = nick
	sid := app.ContextSID(r)
	err = appUserManager.Get().SessionManager.SetUserSession(sid, sUser)
	if err != nil {
		return resp.MustFail(err)
	}

	return resp.MustComplete(nick)
}
