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
	"qing/a/appConf"
	"qing/a/appDB"
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

func setEntity(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()
	var err error

	id := clib.GetIDFromDict(params, "id")
	hasID := id != 0
	entityType := appdef.ContentBaseType(clib.MustGetIntFromDict(params, "entityType"))

	contentDict := clib.MustGetDictFromDict(params, "content")
	var title string
	if entityType == appdef.ContentBaseTypePost || entityType == appdef.ContentBaseTypeFPost {
		title = clib.MustGetStringFromDict(contentDict, "title", appdef.LenMaxTitle)
	}
	summary := clib.MustGetTextFromDict(contentDict, "summary")
	contentHTML, sanitizedToken := appService.Get().Sanitizer.Sanitize(clib.MustGetTextFromDict(contentDict, "contentHTML"))
	contentSrc := jsonx.GetStringOrNil(contentDict, "contentSrc")

	var result any
	db := appDB.DB()
	if !hasID {
		// Add a new entry.
		captResult := 0
		var forumID *uint64
		if appConf.Get().FourmsEnabled() && entityType != appdef.ContentBaseTypePost {
			forumIDValue := clib.MustGetIDFromDict(params, "forumID")
			forumID = &forumIDValue
		}

		switch entityType {
		case appdef.ContentBaseTypePost:
			{
				insertedID, err := da.Post.InsertItem(db, uid, contentHTML, contentSrc, title, summary, sanitizedToken, captResult)
				app.PanicOn(err)

				result = appURL.Get().Post(insertedID)
				break
			}

		case appdef.ContentBaseTypeFPost:
			{
				insertedID, err := da.FPost.InsertItem(db, uid, contentHTML, contentSrc, title, summary, forumID, sanitizedToken, captResult)
				app.PanicOn(err)

				result = appURL.Get().FPost(insertedID)
				break
			}

		default:
			panic(fmt.Errorf("unsupported entity type %v", entityType))
		}
	} else {
		// Edit an existing entry.
		switch entityType {
		case appdef.ContentBaseTypePost:
			{
				err = da.Post.EditItem(db, id, uid, contentHTML, title, summary, sanitizedToken)
				app.PanicOn(err)
				break
			}
		case appdef.ContentBaseTypeFPost:
			{
				err = da.FPost.EditItem(db, id, uid, contentHTML, title, summary, sanitizedToken)
				app.PanicOn(err)
				break
			}
		default:
			panic(fmt.Errorf("unsupported entity type %v", entityType))
		}
	}

	return resp.MustComplete(result)
}
