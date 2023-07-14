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
	"qing/a/appEnv"
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
	contentLoader := NewPostCoreContentLoader(contentDict)

	var title string
	if entityType == frozenDef.ContentBaseTypePost || entityType == frozenDef.ContentBaseTypeFPost {
		title = contentLoader.MustGetTitle()
	}
	summary := contentLoader.MustGetSummary()
	contentHTML, sanitizedToken := appService.Get().Sanitizer.Sanitize(contentLoader.MustGetHTML())
	contentSrc := contentLoader.GetOptionalSrc()

	cfg := coreConfig.Get()
	var result any
	db := appDB.DB()
	if !hasID {
		// Add a new entry.
		// ----- Do rate limiting first -----
		ok, err := appService.Get().RateLmt.RequestPostCore(uid)
		appcm.PanicOn(err)
		if !ok {
			return resp.MustFail(resp.LS().RateLimitExceededErr)
		}
		// ----- End of rate limiting -----

		captResult := 0
		var forumID *uint64
		if cfg.ForumsEnabled() && entityType != frozenDef.ContentBaseTypePost {
			forumIDValue := clib.MustGetIDFromDict(params, "forumID")
			forumID = &forumIDValue
		}

		var insertedID uint64
		switch entityType {
		case frozenDef.ContentBaseTypePost:
			{
				insertedID, err = da.Post.InsertItem(db, uid, contentHTML, contentSrc, title, summary, sanitizedToken, captResult)
				appcm.PanicOn(err)

				result = appURL.Get().Post(insertedID)
				break
			}

		case frozenDef.ContentBaseTypeFPost:
			{
				insertedID, err = da.FPost.InsertItem(db, uid, contentHTML, contentSrc, title, summary, forumID, sanitizedToken, captResult)
				appcm.PanicOn(err)

				result = appURL.Get().FPost(insertedID)
				break
			}

		default:
			panic(fmt.Errorf("unsupported entity type %v", entityType))
		}

		if appEnv.IsBR() {
			tsStr := jsonx.GetStringOrDefault(contentDict, appDef.BrTime)
			if tsStr != "" {
				ts, err := clib.ParseTime(tsStr)
				appcm.PanicOn(err)
				switch entityType {
				case frozenDef.ContentBaseTypePost:
					{
						err = da.Post.DevUpdateCreated(db, insertedID, ts, ts)
						appcm.PanicOn(err)
						break
					}

				case frozenDef.ContentBaseTypeFPost:
					{
						err = da.FPost.DevUpdateCreated(db, insertedID, ts, ts)
						appcm.PanicOn(err)
						break
					}

				default:
					panic(fmt.Errorf("unsupported entity type %v", entityType))
				}
			}
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

		if appEnv.IsBR() {
			tsStr := jsonx.GetStringOrDefault(contentDict, appDef.BrTime)
			if tsStr != "" {
				ts, err := clib.ParseTime(tsStr)
				appcm.PanicOn(err)
				switch entityType {
				case frozenDef.ContentBaseTypePost:
					{
						err = da.Post.DevUpdateModified(db, id, ts)
						appcm.PanicOn(err)
						break
					}

				case frozenDef.ContentBaseTypeFPost:
					{
						err = da.FPost.DevUpdateModified(db, id, ts)
						appcm.PanicOn(err)
						break
					}

				default:
					panic(fmt.Errorf("unsupported entity type %v", entityType))
				}
			}
		}
	}

	return resp.MustComplete(result)
}
