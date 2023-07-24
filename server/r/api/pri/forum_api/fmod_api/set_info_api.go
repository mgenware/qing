/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fmodapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

func setInfoAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	fid := appcm.ContextForumID(r.Context())
	name := clib.MustGetStringFromDict(params, "name", appDef.LenMaxName)
	desc := jsonx.GetStringOrDefault(params, "desc")
	descSrc := jsonx.GetStringOrNil(params, "descSrc")

	db := appDB.DB()
	err := da.Forum.UpdateInfo(db, fid, name, desc, descSrc)
	appcm.PanicOn(err, "failed to update forum info")
	return resp.MustComplete(nil)
}
