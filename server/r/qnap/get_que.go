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
	voteapi "qing/r/api/pri/vote_api"
	"qing/r/rcom"
	"qing/r/sys"
	"qing/sod/qna/qnaWindObj"
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
		ansListHTMLBuilder.WriteString("<p class=\"__qing_ls__\">noAnswers</p>")
	} else {
		for _, item := range ansList {
			myVote, err := voteapi.FetchMyVote(item.ID, uid)
			app.PanicIfErr(err)
			itemModel := NewAnswerAppModel(&item, myVote)
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

	forumID := ""
	if que.ForumID != nil {
		forumID = fmtx.EncodeID(*que.ForumID)
	}
	d.WindData = qnaWindObj.NewQnaWind(fmtx.EncodeID(qid), forumID)
	return resp.MustComplete(d)
}
