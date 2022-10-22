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
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func delEntity(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	entity := clib.MustGetEntityInfoFromDict(params, "entity")
	id := entity.ID
	db := appDB.DB()
	var err error
	var result any

	switch entity.Type {
	case appdef.ContentBaseTypePost:
		{
			err := da.Post.DeleteItem(appDB.DB(), id, uid)
			app.PanicOn(err)
			result = appURL.Get().UserProfile(uid)
			break
		}
	case appdef.ContentBaseTypeFPost:
		{
			err = da.FPost.DeleteItem(db, id, uid)
			app.PanicOn(err)
			break
		}
	default:
		panic(fmt.Errorf("unsupported entity type %v", entity.Type))
	}

	return resp.MustComplete(result)
}
