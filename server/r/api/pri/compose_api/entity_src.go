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
	"qing/a/appHandler"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func entitySrc(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	entity := clib.MustGetEntityInfoFromDict(params, "entity")
	id := entity.ID
	db := appDB.DB()
	var res da.EntityGetSrcResult
	var err error

	switch entity.Type {
	case appdef.ContentBaseTypePost:
		res, err = da.Post.SelectItemSrc(db, id, uid)
	case appdef.ContentBaseTypeCmt:
		res, err = da.Cmt.SelectCmtSource(db, id, uid)
	case appdef.ContentBaseTypeThread:
		res, err = da.FPost.SelectItemSrc(db, id, uid)
	default:
		panic(fmt.Errorf("unsupported entity type %v", entity.Type))
	}
	app.PanicOn(err)
	return resp.MustComplete(res)
}
