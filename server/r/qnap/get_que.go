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
	"qing/lib/validator"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

const qnaEntry = "qnaEntry"

// GetQuestion is the HTTP handler for questions.
func GetQuestion(w http.ResponseWriter, r *http.Request) handler.HTML {
	pid, err := validator.DecodeID(chi.URLParam(r, "qid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	que, err := da.Question.SelectItemByID(appDB.DB(), pid)
	app.PanicIfErr(err)

	resp := appHandler.HTMLResponse(w, r)
	queModel := NewQuestionPageModel(&que)
	title := que.Title
	d := appHandler.MainPageData(title, vQuestionPage.MustExecuteToString(queModel))
	d.Scripts = appHandler.MainPage().ScriptString(qnaEntry)
	return resp.MustComplete(d)
}
