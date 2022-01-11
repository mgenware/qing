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
	"qing/a/defs"
	"qing/a/handler"
	"qing/app"
	"qing/da"
	"qing/lib/validator"
)

func deleteEntity(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	id := validator.MustGetIDFromDict(params, "id")
	entityType := validator.MustGetIntFromDict(params, "entityType")
	db := appDB.DB()
	var err error
	var result interface{}

	switch entityType {
	case defs.Shared.EntityPost:
		{
			err := da.Post.DeleteItem(appDB.DB(), id, uid)
			app.PanicIfErr(err)
			result = appURL.Get().UserProfile(uid)
			break
		}
	case defs.Shared.EntityDiscussion:
		{
			err = da.Discussion.DeleteItem(db, id, uid)
			app.PanicIfErr(err)
			break
		}
	case defs.Shared.EntityQuestion:
		{
			err = da.Question.DeleteItem(db, id, uid)
			app.PanicIfErr(err)
			break
		}
	case defs.Shared.EntityAnswer:
		{
			err = da.Answer.DeleteItem(db, id, uid)
			app.PanicIfErr(err)
			break
		}
	default:
		panic(fmt.Sprintf("Unsupported entity type %v", entityType))
	}

	return resp.MustComplete(result)
}
