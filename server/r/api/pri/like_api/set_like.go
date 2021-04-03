/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package likeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/handler"
	"qing/lib/validator"
)

func setLike(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	category := validator.MustGetIntFromDict(params, "type")
	id := validator.MustGetIDFromDict(params, "id")
	value := validator.MustGetIntFromDict(params, "value")
	dbSrc := dbSources[category]

	if dbSrc == nil {
		panic(fmt.Sprintf("Unsupported type %v", category))
	}

	if value == 1 {
		app.PanicIfErr(dbSrc.Like(appDB.Get().DB(), id, uid))
	} else {
		app.PanicIfErr(dbSrc.CancelLike(appDB.Get().DB(), id, uid))
	}
	return resp.MustComplete(nil)
}
