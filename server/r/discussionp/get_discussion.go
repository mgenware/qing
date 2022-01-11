/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package discussionp

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/da"
	"qing/lib/fmtx"
	"qing/lib/validator"
	"qing/r/rcom"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi/v5"
)

const defaultPageSize = 20

const discussionScript = "discussionEntry"

// GetDiscussion is the HTTP handler for discussions.
func GetDiscussion(w http.ResponseWriter, r *http.Request) handler.HTML {
	tid, err := fmtx.DecodeID(chi.URLParam(r, "tid"))
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
	d.Scripts = appHandler.MainPage().ScriptString(discussionScript)
	d.WindData = DiscussionPageWindData{EID: discussionModel.EID, ReplyCount: discussion.ReplyCount}
	return resp.MustComplete(d)
}
