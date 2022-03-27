/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package threadp

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
)

var vThreadMsgApp = appHandler.MainPage().MustParseView("/qna/threadMsgApp.html")

type ThreadMsgAppModel struct {
	da.ThreadMsgTableSelectItemsByQuestionResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	ThreadMsgURL string
	EID          string
	Vote         int
	UserEID      string
	UserHTML     string
	CreatedAt    string
	ModifiedAt   string
	MyVote       int
}

func NewThreadMsgAppModel(p *da.ThreadMsgTableSelectItemsByQuestionResult, myVote int) ThreadMsgAppModel {
	d := ThreadMsgAppModel{ThreadMsgTableSelectItemsByQuestionResult: *p}
	eid := clib.EncodeID(p.ID)
	d.ThreadMsgURL = appURL.Get().ThreadMsg(p.ID)
	d.EID = eid
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	d.UserEID = clib.EncodeID(d.UserID)
	pu := rcom.NewPostUserAppInput(d.UserID, d.UserName, d.UserIconName, eid, appdef.ContentBaseTypeAns, d.CreatedAt, d.ModifiedAt)
	pu.ExtraLinkLS = "link"
	pu.ExtraLink = d.AnswerURL
	d.UserHTML = rcom.GetPostUserAppHTML(&pu)
	d.MyVote = myVote
	return d
}
