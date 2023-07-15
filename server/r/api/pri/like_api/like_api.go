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
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/lib/clib"
)

func likeAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()

	category := clib.MustGetIntFromDict(params, "type")
	id := clib.MustGetIDFromDict(params, "id")
	value := clib.MustGetIntFromDict(params, "value")
	dbSrc := dbSources[frozenDef.ContentBaseType(category)]

	if dbSrc == nil {
		panic(fmt.Errorf("unsupported type %v", category))
	}

	db := appDB.DB()
	currentVal, err := dbSrc.HasLiked(db, id, uid)
	appcm.PanicOn(err, "failed to check like status")

	if currentVal == (value == 1) {
		panic(fmt.Errorf("like status mismatch: %v", currentVal))
	}

	if value == 1 {
		appcm.PanicOn(dbSrc.Like(db, id, uid), "failed to like")
	} else {
		appcm.PanicOn(dbSrc.CancelLike(db, id, uid), "failed to cancel like")
	}
	return resp.MustComplete(nil)
}
