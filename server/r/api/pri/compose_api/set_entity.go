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
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"time"
)

func setEntity(w http.ResponseWriter, r *http.Request) handler.JSON {
	conf := app.CoreConfig()
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()
	var err error

	id := clib.GetIDFromDict(params, "id")
	hasID := id != 0
	entityType := clib.MustGetIntFromDict(params, "entityType")

	contentDict := clib.MustGetDictFromDict(params, "content")
	var title string
	if entityType != appdef.EntityDiscussionMsg && entityType != appdef.EntityAnswer {
		title = clib.MustGetStringFromDict(contentDict, "title", appdef.MaxTitleLen)
	}

	contentHTML, sanitizedToken := appService.Get().Sanitizer.Sanitize(clib.MustGetTextFromDict(contentDict, "contentHTML"))

	var result interface{}
	db := appDB.DB()
	if !hasID {
		// Add a new entry.
		captResult, err := appService.Get().Captcha.Verify(uid, appdef.EntityPost, "", conf.DevMode())
		app.PanicIfErr(err)
		if captResult != 0 {
			return resp.MustFailWithCode(captResult)
		}

		var forumID *uint64
		if appSettings.Get().Forums() && entityType != appdef.EntityPost {
			forumIDValue := clib.MustGetIDFromDict(params, "forumID")
			forumID = &forumIDValue
		}

		now := time.Now()
		switch entityType {
		case appdef.EntityPost:
			{
				insertedID, err := da.Post.InsertItem(db, title, contentHTML, uid, now, now, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = appURL.Get().Post(insertedID)
				break
			}

		case appdef.EntityDiscussion:
			{
				insertedID, err := da.Discussion.InsertItem(db, forumID, title, contentHTML, uid, now, now, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = appURL.Get().Discussion(insertedID)
				break
			}

		case appdef.EntityDiscussionMsg:
			{
				discussionID := clib.GetIDFromDict(params, "discussionID")
				_, err := da.DiscussionMsg.InsertItem(db, contentHTML, uid, now, now, discussionID, sanitizedToken, captResult)
				app.PanicIfErr(err)
				break
			}

		case appdef.EntityQuestion:
			{
				insertedID, err := da.Question.InsertItem(db, forumID, title, contentHTML, uid, now, now, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = appURL.Get().Question(insertedID)
				break
			}

		case appdef.EntityAnswer:
			{
				questionID := clib.GetIDFromDict(params, "questionID")
				insertedID, err := da.Answer.InsertItem(db, contentHTML, uid, now, now, questionID, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = appURL.Get().Question(insertedID)
				break
			}

		default:
			panic(fmt.Sprintf("Unsupported entity type %v", entityType))
		}
	} else {
		// Edit an existing entry.
		now := time.Now()
		switch entityType {
		case appdef.EntityPost:
			{
				err = da.Post.EditItem(db, id, uid, title, contentHTML, now, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		case appdef.EntityDiscussion:
			{
				err = da.Discussion.EditItem(db, id, uid, title, contentHTML, now, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		case appdef.EntityDiscussionMsg:
			{
				err = da.DiscussionMsg.EditItem(db, id, uid, contentHTML, now, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		case appdef.EntityQuestion:
			{
				err = da.Question.EditItem(db, id, uid, title, contentHTML, now, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		default:
			panic(fmt.Sprintf("Unsupported entity type %v", entityType))
		}
	}

	return resp.MustComplete(result)
}
