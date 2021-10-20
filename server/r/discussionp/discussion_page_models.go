/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package discussionp

import (
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/app/defs"
	"qing/da"
	"qing/lib/fmtx"
	"qing/r/rcom"
)

var vDiscussionPage = appHandler.MainPage().MustParseView("/discussion/discussionPage.html")
var vMessageItem = appHandler.MainPage().MustParseView("/discussion/messageItem.html")

// DiscussionPageModel is a wrapper around da.DiscussionTableSelectPostByIDResult.
type DiscussionPageModel struct {
	da.DiscussionTableSelectItemByIDResult

	// Those props are used by template and not exposed in any API. No JSON keys attached.
	DiscussionURL   string
	UserHTML        string
	EID             string
	MessageListHTML string
	PageBarHTML     string
	CreatedAt       string
	ModifiedAt      string
}

// DiscussionPageWindData ...
type DiscussionPageWindData struct {
	EID        string
	ReplyCount uint
}

// DiscussionMsgModel is a wrapper around da.DiscussionMsgTableSelectItemsByDiscussionResult.
type DiscussionMsgModel struct {
	da.DiscussionMsgTableSelectItemsByDiscussionResult

	DiscussionURL string
	UserHTML      string
	EID           string
	CreatedAt     string
	ModifiedAt    string
}

// NewDiscussionPageModel creates a DiscussionPageModel.
func NewDiscussionPageModel(p *da.DiscussionTableSelectItemByIDResult, msgListHTML string, pageBarHTML string) DiscussionPageModel {
	d := DiscussionPageModel{DiscussionTableSelectItemByIDResult: *p}
	eid := fmtx.EncodeID(p.ID)
	d.DiscussionURL = eid
	d.EID = fmtx.EncodeID(p.ID)
	d.CreatedAt = fmtx.Time(d.RawCreatedAt)
	d.ModifiedAt = fmtx.Time(d.RawModifiedAt)
	pu := rcom.NewPostUserAppInput(p.UserID, p.UserName, p.UserIconName, eid, defs.Shared.EntityDiscussion, d.CreatedAt, d.ModifiedAt)
	d.UserHTML = rcom.GetPostUserAppHTML(&pu)
	d.MessageListHTML = msgListHTML
	d.PageBarHTML = pageBarHTML
	return d
}

// NewDiscussionMsgModel creates a DiscussionMsgModel.
func NewDiscussionMsgModel(p *da.DiscussionMsgTableSelectItemsByDiscussionResult) DiscussionMsgModel {
	d := DiscussionMsgModel{DiscussionMsgTableSelectItemsByDiscussionResult: *p}
	eid := fmtx.EncodeID(p.ID)
	d.DiscussionURL = appURL.Get().Discussion(p.ID)
	d.EID = eid
	pu := rcom.NewPostUserAppInput(p.UserID, p.UserName, p.UserIconName, eid, defs.Shared.EntityDiscussionMsg, d.CreatedAt, d.ModifiedAt)
	d.UserHTML = rcom.GetPostUserAppHTML(&pu)
	return d
}
