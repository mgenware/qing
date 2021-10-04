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
	"qing/app/appUserManager"
	"qing/app/handler"
	"qing/da"

	"github.com/mgenware/go-packagex/v6/jsonx"
)

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
	status := jsonx.GetStringOrDefault(params, "status")
	bio := jsonx.GetStringOrDefault(params, "bio")
	var bioPtr *string
	if bio != "" {
		bioPtr = &bio
	}

	// Update DB
	err := da.User.UpdateProfile(appDB.DB(), uid, nick, website, company, location, status, bioPtr)
	if err != nil {
		return resp.MustFail(err)
	}
	// Update session
	sUser.Name = nick
	sid := app.ContextSID(r)
	err = appUserManager.Get().UpdateUserSession(sid, sUser)
	if err != nil {
		return resp.MustFail(err)
	}

	return resp.MustComplete(nick)
}
