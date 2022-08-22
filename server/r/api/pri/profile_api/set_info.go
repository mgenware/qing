/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"fmt"
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appUserManager"
	"qing/a/handler"
	"qing/da"

	"github.com/mgenware/goutil/jsonx"
)

func setInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	sUser := resp.User()
	uid := resp.UserID()

	nick := jsonx.GetString(params, "name")
	if nick == "" {
		panic(fmt.Errorf("the argument `name` cannot be empty"))
	}
	website := jsonx.GetString(params, "website")
	company := jsonx.GetString(params, "company")
	location := jsonx.GetString(params, "location")
	bio := jsonx.GetString(params, "bio")
	var bioPtr *string
	if bio != "" {
		bioPtr = &bio
	}

	// Update DB
	err := da.User.UpdateProfile(appDB.DB(), uid, nick, website, company, location, bioPtr)
	if err != nil {
		resp.MustFail(fmt.Sprintf("Error updating profile: %v", err))
	}
	// Update session
	sUser.Name = nick
	sid := app.ContextSID(r)
	err = appUserManager.Get().UpdateUserSession(sid, sUser)
	if err != nil {
		resp.MustFail(fmt.Sprintf("Error updating user session: %v", err))
	}

	return resp.MustComplete(nick)
}
