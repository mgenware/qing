/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package qnap

import (
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/app/defs"
	"qing/da"
	"qing/lib/fmtx"
	"qing/r/rcom"
)

var vQuestionPage = appHandler.MainPage().MustParseView("/qna/questionPage.html")

// QuestionPageModel is a wrapper around da.QuestionTableSelectPostByIDResult.
type QuestionPageModel struct {
	da.QuestionTableSelectItemByIDResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	QuestionURL string
	EID         string
	Liked       bool
	UserEID     string
	UserHTML    string
}

// NewQuestionPageModel creates a PostPageModel.
func NewQuestionPageModel(p *da.QuestionTableSelectItemByIDResult) QuestionPageModel {
	d := QuestionPageModel{QuestionTableSelectItemByIDResult: *p}
	eid := fmtx.EncodeID(p.ID)
	d.QuestionURL = appURL.Get().Question(p.ID)
	d.EID = eid
	d.UserEID = fmtx.EncodeID(d.UserID)
	d.UserHTML = rcom.GetUserItemViewHTML(d.UserID, d.UserName, d.UserIconName, eid, defs.Shared.EntityPost, d.CreatedAt, d.ModifiedAt)
	return d
}
