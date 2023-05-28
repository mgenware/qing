/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import (
	"fmt"
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/appcm"
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func delEntity(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()

	entity := clib.MustGetEntityInfoFromDict(params, "entity")
	id := entity.ID
	db := appDB.DB()
	var err error
	var result any

	switch entity.Type {
	case frozenDef.ContentBaseTypePost:
		{
			err := da.Post.DeleteItem(appDB.DB(), id, uid)
			appcm.PanicOn(err)
			result = appURL.Get().UserProfile(uid)
			break
		}
	case frozenDef.ContentBaseTypeFPost:
		{
			err = da.FPost.DeleteItem(db, id, uid)
			appcm.PanicOn(err)
			break
		}
	default:
		panic(fmt.Errorf("unsupported entity type %v", entity.Type))
	}

	return resp.MustComplete(result)
}
