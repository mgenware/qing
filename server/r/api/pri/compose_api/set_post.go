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
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func setPost(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()
	var err error

	id := validator.GetIDFromDict(params, "id")
	hasID := id != 0
	entityType := validator.MustGetIntFromDict(params, "entityType")

	contentDict := validator.MustGetDictFromDict(params, "content")
	var title string
	if entityType != defs.Shared.EntityDiscussionMsg {
		title = validator.MustGetStringFromDict(contentDict, "title", defs.DB.MaxTitleLen)
	}

	contentHTML, sanitizedToken := app.Service.Sanitizer.Sanitize(validator.MustGetTextFromDict(contentDict, "contentHTML"))

	var result interface{}
	db := appDB.Get().DB()
	if !hasID {
		// Add a new entry.
		captResult, err := app.Service.Captcha.Verify(uid, defs.Shared.EntityPost, "", app.Config.DevMode())
		app.PanicIfErr(err)
		if captResult != 0 {
			return resp.MustFailWithCode(captResult)
		}

		var forumID *uint64
		if app.SetupConfig().ForumsMode && entityType != defs.Shared.EntityPost {
			forumIDValue := validator.MustGetIDFromDict(params, "forumID")
			forumID = &forumIDValue
		}

		switch entityType {
		case defs.Shared.EntityPost:
			{
				insertedID, err := da.Post.InsertItem(db, title, contentHTML, uid, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = app.URL.Post(insertedID)
				break
			}

		case defs.Shared.EntityDiscussion:
			{
				insertedID, err := da.Discussion.InsertItem(db, forumID, title, contentHTML, uid, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = app.URL.Discussion(insertedID)
				break
			}

		case defs.Shared.EntityDiscussionMsg:
			{
				discussionID := validator.GetIDFromDict(params, "discussionID")
				_, err := da.DiscussionMsg.InsertItem(db, contentHTML, uid, discussionID, sanitizedToken, captResult)
				app.PanicIfErr(err)
				break
			}

		case defs.Shared.EntityQuestion:
			{
				insertedID, err := da.Question.InsertItem(db, forumID, title, contentHTML, uid, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = app.URL.Question(insertedID)
				break
			}

		default:
			panic(fmt.Sprintf("Unsupported entity type %v", entityType))
		}
	} else {
		// Edit an existing entry.
		switch entityType {
		case defs.Shared.EntityPost:
			{
				err = da.Post.EditItem(db, id, uid, title, contentHTML, sanitizedToken)
				app.PanicIfErr(err)

				result = app.URL.Post(id)
				break
			}
		case defs.Shared.EntityDiscussion:
			{
				err = da.Discussion.EditItem(db, id, uid, title, contentHTML, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		case defs.Shared.EntityDiscussionMsg:
			{
				err = da.DiscussionMsg.EditItem(db, id, uid, contentHTML, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		default:
			panic(fmt.Sprintf("Unsupported entity type %v", entityType))
		}
	}

	return resp.MustComplete(result)
}
