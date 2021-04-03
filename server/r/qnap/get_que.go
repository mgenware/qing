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
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

// GetQuestion is the HTTP handler for questions.
func GetQuestion(w http.ResponseWriter, r *http.Request) handler.HTML {
	pid, err := validator.DecodeID(chi.URLParam(r, "qid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	que, err := da.Question.SelectItemByID(appDB.Get().DB(), pid)
	app.PanicIfErr(err)

	resp := app.HTMLResponse(w, r)
	queModel := NewQuestionPageModel(&que)
	title := que.Title
	d := app.MainPageData(title, vQuestionPage.MustExecuteToString(queModel))
	d.Scripts = app.MainPageManager.AssetsManager.JS.Post
	return resp.MustComplete(d)
}
