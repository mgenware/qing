/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package composeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func getEntitySrc(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	id := validator.MustGetIDFromDict(params, "entityID")
	entityType := validator.MustGetIntFromDict(params, "entityType")

	db := app.DB
	var res GetSrcResp
	var err error

	switch entityType {
	case defs.Shared.EntityPost:
		res, err = da.Post.SelectItemForEditing(db, id, uid)
	default:
		return resp.MustFailWithUserError(fmt.Sprintf("Unsupported entity type %v", entityType))
	}
	app.PanicIfErr(err)
	return resp.MustComplete(res)
}
