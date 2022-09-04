/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
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
	"qing/a/handler"
	"qing/da"

	"github.com/mgenware/goutil/jsonx"
)

func setLang(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	lang := jsonx.GetString(params, "lang")
	if lang == "" {
		panic(fmt.Errorf("the argument `lang` cannot be empty"))
	}

	// Update DB
	err := da.User.UpdateLang(appDB.DB(), uid, lang)
	if err != nil {
		resp.MustFail(fmt.Sprintf("Error updating lang: %v", err))
	}
	return resp.MustComplete(nil)
}
