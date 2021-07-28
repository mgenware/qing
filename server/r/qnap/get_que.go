/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package qnap

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/da"
	"qing/lib/fmtx"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

const qnaEntry = "qnaEntry"

// GetQuestion is the HTTP handler for questions.
func GetQuestion(w http.ResponseWriter, r *http.Request) handler.HTML {
	pid, err := fmtx.DecodeID(chi.URLParam(r, "qid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	db := appDB.DB()
	que, err := da.Question.SelectItemByID(db, pid)
	app.PanicIfErr(err)

	resp := appHandler.HTMLResponse(w, r)
	uid := resp.UserID()
	title := que.Title

	hasLiked := false
	if uid != 0 {
		liked, err := da.QuestionLike.HasLiked(db, pid, uid)
		app.PanicIfErr(err)
		hasLiked = liked
	}

	queAppModel := NewQuestionAppModel(&que, hasLiked)

	quePageModel := NewQuestionPageModel(vQuestionApp.MustExecuteToString(queAppModel), "")

	d := appHandler.MainPageData(title, vQuestionPage.MustExecuteToString(quePageModel))
	d.Scripts = appHandler.MainPage().ScriptString(qnaEntry)
	return resp.MustComplete(d)
}
