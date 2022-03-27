/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package threadp

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
	"qing/r/sys"
	"qing/sod/qna/qnaWind"
	"strings"

	"github.com/go-chi/chi/v5"
)

const threadEntryScriptName = "thread/threadEntry"
const defaultPageSize = 10

func GetThread(w http.ResponseWriter, r *http.Request) handler.HTML {
	qid, err := clib.DecodeID(chi.URLParam(r, "qid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := clib.GetPageParamFromRequestQueryString(r)
	db := appDB.DB()
	que, err := da.Thread.SelectItemByID(db, qid)
	app.PanicIfErr(err)

	resp := appHandler.HTMLResponse(w, r)
	uid := resp.UserID()
	title := que.Title

	hasLiked := false
	if uid != 0 {
		liked, err := da.ThreadLike.HasLiked(db, qid, uid)
		app.PanicIfErr(err)
		hasLiked = liked
	}

	queAppModel := NewThreadAppModel(&que, hasLiked)

	// Fetch thread messages.
	threadMsgList, hasNext, err := da.ThreadMsg.SelectItemsByThread(db, qid, page, defaultPageSize)
	app.PanicIfErr(err)

	var ansListHTMLBuilder strings.Builder
	if len(threadMsgList) == 0 {
		ansListHTMLBuilder.WriteString("<p class=\"__qing_ls__\">noReplies</p>")
	} else {
		for _, item := range threadMsgList {
			myVote, err := voteapi.FetchMyVote(item.ID, uid)
			app.PanicIfErr(err)
			itemModel := NewThreadMsgAppModel(&item, myVote)
			app.PanicIfErr(err)
			ansListHTMLBuilder.WriteString(vAnswerApp.MustExecuteToString(itemModel))
		}
	}

	threadURLFormatter := NewThreadURLFormatter(qid)
	pageData := rcom.NewPageData(page, hasNext, threadURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	threadPageModel := NewThreadPageModel(vThreadApp.MustExecuteToString(threadAppModel), ansListHTMLBuilder.String(), pageBarHTML)
	d := appHandler.MainPageData(title, vThreadPage.MustExecuteToString(threadPageModel))
	d.Scripts = appHandler.MainPage().ScriptString(threadEntryScriptName)

	forumID := ""
	if que.ForumID != nil {
		forumID = clib.EncodeID(*que.ForumID)
	}
	d.WindData = qnaWind.NewQnaWind(clib.EncodeID(qid), forumID)
	return resp.MustComplete(d)
}
