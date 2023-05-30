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
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/appcm"
	"qing/a/coreConfig"
	"qing/a/def/appDef"
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

func setEntity(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()
	var err error

	id := clib.GetIDFromDict(params, "id")
	hasID := id != 0
	entityType := frozenDef.ContentBaseType(clib.MustGetIntFromDict(params, "entityType"))

	contentDict := clib.MustGetDictFromDict(params, "content")
	var title string
	if entityType == frozenDef.ContentBaseTypePost || entityType == frozenDef.ContentBaseTypeFPost {
		title = clib.MustGetStringFromDict(contentDict, "title", appDef.LenMaxTitle)
	}
	summary := clib.MustGetTextFromDict(contentDict, "summary")
	contentHTML, sanitizedToken := appService.Get().Sanitizer.Sanitize(clib.MustGetTextFromDict(contentDict, "html"))
	contentSrc := jsonx.GetStringOrNil(contentDict, "src")

	cfg := coreConfig.Get()
	var result any
	db := appDB.DB()
	if !hasID {
		// Add a new entry.
		// ----- Do rate limiting first -----
		ok, err := appService.Get().RateLmt.TakeFromUID(uid)
		appcm.PanicOn(err)
		if !ok {
			return resp.MustFail(resp.LS().RateLimitExceededErr)
		}
		// ----- End of rate limiting -----

		captResult := 0
		var forumID *uint64
		if cfg.FourmsEnabled() && entityType != frozenDef.ContentBaseTypePost {
			forumIDValue := clib.MustGetIDFromDict(params, "forumID")
			forumID = &forumIDValue
		}

		switch entityType {
		case frozenDef.ContentBaseTypePost:
			{
				insertedID, err := da.Post.InsertItem(db, uid, contentHTML, contentSrc, title, summary, sanitizedToken, captResult)
				appcm.PanicOn(err)

				result = appURL.Get().Post(insertedID)
				break
			}

		case frozenDef.ContentBaseTypeFPost:
			{
				insertedID, err := da.FPost.InsertItem(db, uid, contentHTML, contentSrc, title, summary, forumID, sanitizedToken, captResult)
				appcm.PanicOn(err)

				result = appURL.Get().FPost(insertedID)
				break
			}

		default:
			panic(fmt.Errorf("unsupported entity type %v", entityType))
		}
	} else {
		// Edit an existing entry.
		switch entityType {
		case frozenDef.ContentBaseTypePost:
			{
				err = da.Post.EditItem(db, id, uid, contentHTML, contentSrc, title, summary, sanitizedToken)
				appcm.PanicOn(err)
				break
			}
		case frozenDef.ContentBaseTypeFPost:
			{
				err = da.FPost.EditItem(db, id, uid, contentHTML, contentSrc, title, summary, sanitizedToken)
				appcm.PanicOn(err)
				break
			}
		default:
			panic(fmt.Errorf("unsupported entity type %v", entityType))
		}
	}

	return resp.MustComplete(result)
}
