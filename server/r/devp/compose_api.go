/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func deletePostsByPattern(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	var err error

	pattern := clib.MustGetStringFromDict(params, "pattern", appDef.LenMaxName)
	db := appDB.DB()
	_, err = da.Post.BrDeleteByPattern(db, pattern)
	appcm.PanicOn(err)
	return resp.MustComplete(nil)
}
