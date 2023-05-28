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
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appUserManager"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"

	"github.com/mgenware/goutil/jsonx"
)

func setInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
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
	appcm.PanicOn(err)

	// Update session
	sUser.Name = nick
	sid := appcm.ContextSID(r.Context())
	err = appUserManager.Get().UpdateUserSession(sid, sUser)
	appcm.PanicOn(err)

	return resp.MustComplete(nick)
}
