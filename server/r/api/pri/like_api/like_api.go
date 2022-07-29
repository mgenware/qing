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
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/lib/clib"
)

func likeAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	category := clib.MustGetIntFromDict(params, "type")
	id := clib.MustGetIDFromDict(params, "id")
	value := clib.MustGetIntFromDict(params, "value")
	dbSrc := dbSources[appdef.ContentBaseType(category)]

	if dbSrc == nil {
		panic(fmt.Sprintf("Unsupported type %v", category))
	}

	db := appDB.DB()
	currentVal, err := dbSrc.HasLiked(db, id, uid)
	app.PanicOn(err)

	if currentVal == (value == 1) {
		panic(fmt.Errorf("Like status mismatch: %v", currentVal))
	}

	if value == 1 {
		app.PanicOn(dbSrc.Like(db, id, uid))
	} else {
		app.PanicOn(dbSrc.CancelLike(db, id, uid))
	}
	return resp.MustComplete(nil)
}
