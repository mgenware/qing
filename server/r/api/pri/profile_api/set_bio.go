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
	"qing/app/handler"
	"qing/da"

	"github.com/mgenware/go-packagex/v6/jsonx"
)

func setBio(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	bio := jsonx.GetStringOrDefault(params, "bio")
	if bio == "" {
		panic("The argument `bio` cannot be empty")
	}

	// Update DB
	err := da.User.UpdateBio(appDB.DB(), uid, &bio)
	if err != nil {
		return resp.MustFail(err)
	}
	return resp.MustComplete(nil)
}
