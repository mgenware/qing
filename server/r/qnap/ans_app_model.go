/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package qnap

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/defs"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
)

var vAnswerApp = appHandler.MainPage().MustParseView("/qna/answerApp.html")

// AnswerAppModel ...
type AnswerAppModel struct {
	da.AnswerTableSelectItemsByQuestionResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	AnswerURL  string
	EID        string
	Vote       int
	UserEID    string
	UserHTML   string
	CreatedAt  string
	ModifiedAt string
	MyVote     int
}

// NewAnswerAppModel creates a AnswerAppModel.
func NewAnswerAppModel(p *da.AnswerTableSelectItemsByQuestionResult, myVote int) AnswerAppModel {
	d := AnswerAppModel{AnswerTableSelectItemsByQuestionResult: *p}
	eid := clib.EncodeID(p.ID)
	d.AnswerURL = appURL.Get().Answer(p.ID)
	d.EID = eid
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	d.UserEID = clib.EncodeID(d.UserID)
	pu := rcom.NewPostUserAppInput(d.UserID, d.UserName, d.UserIconName, eid, defs.Shared.EntityPost, d.CreatedAt, d.ModifiedAt)
	pu.ExtraLinkLS = "link"
	pu.ExtraLink = d.AnswerURL
	d.UserHTML = rcom.GetPostUserAppHTML(&pu)
	d.MyVote = myVote
	return d
}
