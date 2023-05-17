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

	nick := jsonx.GetStringOrDefault(params, "name")
	if nick == "" {
		panic(fmt.Errorf("the argument `name` cannot be empty"))
	}
	website := jsonx.GetStringOrDefault(params, "website")
	company := jsonx.GetStringOrDefault(params, "company")
	location := jsonx.GetStringOrDefault(params, "location")
	bio := jsonx.GetStringOrNil(params, "bio")
	bioSrc := jsonx.GetStringOrNil(params, "bioSrc")

	// Update DB
	err := da.User.UpdateProfile(appDB.DB(), uid, nick, website, company, location, bio, bioSrc)
	app.PanicOn(err)

	// Update session
	sUser.Name = nick
	sid := app.ContextSID(r)
	err = appUserManager.Get().UpdateUserSession(sid, sUser)
	app.PanicOn(err)

	return resp.MustComplete(nick)
}
