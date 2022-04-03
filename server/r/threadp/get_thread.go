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
	threadSod "qing/sod/thread"
	"strings"

	"github.com/go-chi/chi/v5"
)

const threadEntryScriptName = "thread/threadEntry"
const defaultPageSize = 10

func GetThread(w http.ResponseWriter, r *http.Request) handler.HTML {
	tid, err := clib.DecodeID(chi.URLParam(r, "tid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := clib.GetPageParamFromRequestQueryString(r)
	db := appDB.DB()
	thread, err := da.Thread.SelectItemByID(db, tid)
	app.PanicIfErr(err)

	resp := appHandler.HTMLResponse(w, r)
	uid := resp.UserID()
	title := thread.Title

	isThreadLiked := false
	if uid != 0 {
		isThreadLiked, err = da.ThreadLike.HasLiked(db, tid, uid)
		app.PanicIfErr(err)
	}
	threadAppModel := NewThreadAppModel(&thread, isThreadLiked)

	// Fetch thread messages.
	var threadMsgList []da.ThreadMsgResult
	var hasNext bool
	if uid != 0 {
		threadMsgList, hasNext, err = da.ThreadMsg.SelectMsgsByThreadWithLikes(db, uid, tid, page, defaultPageSize)
		app.PanicIfErr(err)
	} else {
		threadMsgList, hasNext, err = da.ThreadMsg.SelectMsgsByThread(db, tid, page, defaultPageSize)
		app.PanicIfErr(err)
	}

	var ansListHTMLBuilder strings.Builder
	if len(threadMsgList) == 0 {
		ansListHTMLBuilder.WriteString("<p class=\"__qing_ls__\">noReplies</p>")
	} else {
		for _, item := range threadMsgList {
			itemModel := NewThreadMsgAppModel(&item)
			app.PanicIfErr(err)
			ansListHTMLBuilder.WriteString(vThreadMsgApp.MustExecuteToString(itemModel))
		}
	}

	threadURLFormatter := NewThreadURLFormatter(tid)
	pageData := rcom.NewPageData(page, hasNext, threadURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	threadPageModel := NewThreadPageModel(vThreadApp.MustExecuteToString(threadAppModel), ansListHTMLBuilder.String(), pageBarHTML)
	d := appHandler.MainPageData(title, vThreadPage.MustExecuteToString(threadPageModel))
	d.Scripts = appHandler.MainPage().ScriptString(threadEntryScriptName)

	var forumID *string
	if thread.ForumID != nil {
		fid := clib.EncodeID(*thread.ForumID)
		forumID = &fid
	}
	d.WindData = threadSod.NewThreadWind(clib.EncodeID(tid), forumID)
	return resp.MustComplete(d)
}
