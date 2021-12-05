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

var vQuestionApp = appHandler.MainPage().MustParseView("/qna/questionApp.html")

// QuestionAppModel ...
type QuestionAppModel struct {
	da.QuestionTableSelectItemByIDResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	QuestionURL string
	EID         string
	ForumEID    string
	Liked       bool
	UserEID     string
	UserHTML    string
	CreatedAt   string
	ModifiedAt  string
	HasLikedNum int
}

// NewQuestionAppModel creates a QuestionAppModel.
func NewQuestionAppModel(p *da.QuestionTableSelectItemByIDResult, hasLiked bool) QuestionAppModel {
	d := QuestionAppModel{QuestionTableSelectItemByIDResult: *p}
	eid := fmtx.EncodeID(p.ID)
	d.QuestionURL = appURL.Get().Question(p.ID)
	d.EID = eid
	if d.ForumID != nil {
		d.ForumEID = fmtx.EncodeID(*d.ForumID)
	}
	d.CreatedAt = fmtx.Time(d.RawCreatedAt)
	d.ModifiedAt = fmtx.Time(d.RawModifiedAt)
	d.UserEID = fmtx.EncodeID(d.UserID)
	pu := rcom.NewPostUserAppInput(d.UserID, d.UserName, d.UserIconName, eid, defs.Shared.EntityQuestion, d.CreatedAt, d.ModifiedAt)
	d.UserHTML = rcom.GetPostUserAppHTML(&pu)
	if hasLiked {
		d.HasLikedNum = 1
	}
	return d
}
