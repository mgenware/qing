/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/appHandler"
	"qing/app/appSettings"
	"qing/app/defs"
	"qing/app/handler"
	"qing/lib/validator"
)

func getSiteSettings(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	var res interface{}
	key := validator.MustGetStringFromDict(params, "key", defs.Shared.MaxNameLen)
	switch key {
	case forumsKey:
		res = appSettings.Get().Forums
	default:
		return resp.MustFail(fmt.Errorf("Unknown settings key \"%v\"", key))
	}

	return resp.MustComplete(res)
}
