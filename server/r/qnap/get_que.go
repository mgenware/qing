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
	"qing/lib/validator"
	"qing/r/rcom"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi"
)

const qnaEntryScriptName = "qna/questionEntry"
const defaultPageSize = 10

// GetQuestion is the HTTP handler for questions.
func GetQuestion(w http.ResponseWriter, r *http.Request) handler.HTML {
	qid, err := fmtx.DecodeID(chi.URLParam(r, "qid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := validator.GetPageParamFromRequestQueryString(r)
	db := appDB.DB()
	que, err := da.Question.SelectItemByID(db, qid)
	app.PanicIfErr(err)

	resp := appHandler.HTMLResponse(w, r)
	uid := resp.UserID()
	title := que.Title

	hasLiked := false
	if uid != 0 {
		liked, err := da.QuestionLike.HasLiked(db, qid, uid)
		app.PanicIfErr(err)
		hasLiked = liked
	}

	queAppModel := NewQuestionAppModel(&que, hasLiked)

	// Fetch answers.
	ansList, hasNext, err := da.Answer.SelectItemsByQuestion(db, qid, page, defaultPageSize)
	app.PanicIfErr(err)

	var ansListHTMLBuilder strings.Builder
	if len(ansList) == 0 {
		ansListHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
	} else {
		for _, item := range ansList {
			itemModel := NewAnswerAppModel(&item)
			app.PanicIfErr(err)
			ansListHTMLBuilder.WriteString(vAnswerApp.MustExecuteToString(itemModel))
		}
	}

	queURLFormatter := NewQueURLFormatter(qid)
	pageData := rcom.NewPageData(page, hasNext, queURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	quePageModel := NewQuestionPageModel(vQuestionApp.MustExecuteToString(queAppModel), ansListHTMLBuilder.String(), pageBarHTML)
	d := appHandler.MainPageData(title, vQuestionPage.MustExecuteToString(quePageModel))
	d.Scripts = appHandler.MainPage().ScriptString(qnaEntryScriptName)
	return resp.MustComplete(d)
}
