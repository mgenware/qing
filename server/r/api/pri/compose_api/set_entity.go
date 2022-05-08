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
	"qing/a/appService"
	"qing/a/appSettings"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"time"
)

func setEntity(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()
	var err error

	id := clib.GetIDFromDict(params, "id")
	hasID := id != 0
	entityType := appdef.ContentBaseType(clib.MustGetIntFromDict(params, "entityType"))

	contentDict := clib.MustGetDictFromDict(params, "content")
	var title string
	if entityType == appdef.ContentBaseTypePost || entityType == appdef.ContentBaseTypeThread {
		title = clib.MustGetStringFromDict(contentDict, "title", appdef.LenMaxTitle)
	}

	contentHTML, sanitizedToken := appService.Get().Sanitizer.Sanitize(clib.MustGetTextFromDict(contentDict, "contentHTML"))

	var result interface{}
	db := appDB.DB()
	if !hasID {
		// Add a new entry.
		captResult := 0
		var forumID *uint64
		if appSettings.Get().Forums() && entityType != appdef.ContentBaseTypePost {
			forumIDValue := clib.MustGetIDFromDict(params, "forumID")
			forumID = &forumIDValue
		}

		now := time.Now()
		switch entityType {
		case appdef.ContentBaseTypePost:
			{
				insertedID, err := da.Post.InsertItem(db, uid, now, now, contentHTML, title, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = appURL.Get().Post(insertedID)
				break
			}

		case appdef.ContentBaseTypeThread:
			{
				insertedID, err := da.Thread.InsertItem(db, uid, now, now, contentHTML, title, forumID, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = appURL.Get().Thread(insertedID)
				break
			}

		case appdef.ContentBaseTypeThreadMsg:
			{
				threadID := clib.GetIDFromDict(params, "threadID")
				insertedID, err := da.ThreadMsg.InsertItem(db, uid, now, now, contentHTML, threadID, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = appURL.Get().ThreadMsg(threadID, insertedID)
				break
			}

		default:
			panic(fmt.Sprintf("Unsupported entity type %v", entityType))
		}
	} else {
		// Edit an existing entry.
		now := time.Now()
		switch entityType {
		case appdef.ContentBaseTypePost:
			{
				err = da.Post.EditItem(db, id, uid, now, contentHTML, title, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		case appdef.ContentBaseTypeThread:
			{
				err = da.Thread.EditItem(db, id, uid, now, contentHTML, title, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		case appdef.ContentBaseTypeThreadMsg:
			{
				err = da.ThreadMsg.EditItem(db, id, uid, now, contentHTML, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		default:
			panic(fmt.Sprintf("Unsupported entity type %v", entityType))
		}
	}

	return resp.MustComplete(result)
}
