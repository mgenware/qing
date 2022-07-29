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
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"time"
)

var defTime time.Time

func init() {
	t, err := time.Parse(time.RFC3339, "2019-01-31T10:11:12Z")
	if err != nil {
		panic(err)
	}
	defTime = t
}

func setDebugTime(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	var err error

	id := clib.MustGetIDFromDict(params, "id")
	entityType := clib.MustGetIntFromDict(params, "type")
	db := appDB.DB()

	switch entityType {
	case int(appdef.ContentBaseTypePost):
		{
			err = da.Post.TestUpdateDates(db, id, defTime, defTime)
			app.PanicOn(err)
			break
		}
	case int(appdef.ContentBaseTypeThread):
		{
			err = da.FPost.TestUpdateDates(db, id, defTime, defTime)
			app.PanicOn(err)
			break
		}
	default:
		panic(fmt.Sprintf("Unsupported entity type %v", entityType))
	}

	return resp.MustComplete(nil)
}
