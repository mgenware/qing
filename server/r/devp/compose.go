/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"fmt"
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"time"
)

func setBRTime(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	var err error

	id := clib.MustGetIDFromDict(params, "id")
	entityType := clib.MustGetIntFromDict(params, "type")
	tsString := clib.MustGetStringFromDict(params, "ts", appDef.LenMaxName)
	ts, err := time.Parse(time.RFC3339, tsString)
	appcm.PanicOn(err)

	db := appDB.DB()

	switch entityType {
	case int(frozenDef.ContentBaseTypePost):
		{
			err = da.Post.DevUpdateCreated(db, id, ts, ts)
			appcm.PanicOn(err)
			break
		}
	case int(frozenDef.ContentBaseTypeFPost):
		{
			err = da.FPost.DevUpdateCreated(db, id, ts, ts)
			appcm.PanicOn(err)
			break
		}
	case int(frozenDef.ContentBaseTypeCmt):
		{
			err = da.Cmt.DevUpdateCreated(db, id, ts, ts)
			appcm.PanicOn(err)
			break
		}
	default:
		panic(fmt.Errorf("unsupported entity type %v", entityType))
	}

	return resp.MustComplete(nil)
}

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
