/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"fmt"
	"log"
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"time"
)

var defTime time.Time

func init() {
	t, err := time.Parse(time.RFC3339, "1990-10-27T10:11:12Z")
	if err != nil {
		panic(err)
	}
	defTime = t
}

func setDebugTime(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	var err error

	id := validator.MustGetIDFromDict(params, "id")
	entityType := validator.MustGetIntFromDict(params, "type")
	db := appDB.DB()

	log.Print(id, entityType)

	switch entityType {
	case defs.Shared.EntityPost:
		{
			err = da.Post.TestUpdateDates(db, id, defTime, defTime)
			app.PanicIfErr(err)
			break
		}
	case defs.Shared.EntityDiscussion:
		{
			err = da.Discussion.TestUpdateDates(db, id, defTime, defTime)
			app.PanicIfErr(err)
			break
		}
	case defs.Shared.EntityDiscussionMsg:
		{
			err = da.DiscussionMsg.TestUpdateDates(db, id, defTime, defTime)
			app.PanicIfErr(err)
			break
		}
	default:
		panic(fmt.Sprintf("Unsupported entity type %v", entityType))
	}

	return resp.MustComplete(nil)
}
