/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package discussionp

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi"
)

const defaultPageSize = 20

// GetDiscussion is the HTTP handler for discussions.
func GetDiscussion(w http.ResponseWriter, r *http.Request) handler.HTML {
	tid, err := validator.DecodeID(chi.URLParam(r, "tid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}

	// Get discussion.
	page := validator.GetPageParamFromRequestQueryString(r)
	discussion, err := da.Discussion.SelectItemByID(appDB.DB(), tid)
	app.PanicIfErr(err)

	// Get messages.
	rawMsgs, hasNext, err := da.DiscussionMsg.SelectItemsByDiscussion(appDB.DB(), tid, page, defaultPageSize)
	app.PanicIfErr(err)

	var msgListBuilder strings.Builder
	for _, m := range rawMsgs {
		msgModel := NewDiscussionMsgModel(&m)
		msgListBuilder.WriteString(vMessageItem.MustExecuteToString(msgModel))
	}

	// Setup page data.
	pageURLFormatter := &DiscussionPageURLFormatter{ID: tid}
	pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, int(discussion.ReplyCount))
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	resp := appHandler.HTMLResponse(w, r)
	discussionModel := NewDiscussionPageModel(&discussion, msgListBuilder.String(), pageBarHTML)
	title := discussion.Title
	d := appHandler.MainPageData(title, vDiscussionPage.MustExecuteToString(discussionModel))
	d.Scripts = appHandler.MainPage().AssetManager().JS.Discussion
	d.WindData = DiscussionPageWindData{EID: discussionModel.EID, ReplyCount: discussion.ReplyCount}
	return resp.MustComplete(d)
}
