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
	"qing/app"
	"qing/app/appDB"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func deletePost(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	id := validator.MustGetIDFromDict(params, "id")
	entityType := validator.MustGetIntFromDict(params, "entityType")
	db := appDB.Get().DB()
	var err error
	var result interface{}

	switch entityType {
	case defs.Shared.EntityPost:
		{
			err := da.Post.DeleteItem(appDB.Get().DB(), id, uid)
			app.PanicIfErr(err)
			result = app.URL.UserProfile(uid)
			break
		}
	case defs.Shared.EntityDiscussion:
		{
			err = da.Discussion.DeleteItem(db, id, uid)
			app.PanicIfErr(err)
			break
		}
	default:
		panic(fmt.Sprintf("Unsupported entity type %v", entityType))
	}

	return resp.MustComplete(result)
}
