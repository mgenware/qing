/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package discussionp

import (
	"qing/app"
	"qing/app/appHandler"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
)

var vDiscussionPage = appHandler.MainPage.MustParseView("/discussion/discussionPage.html")
var vMessageItem = appHandler.MainPage.MustParseView("/discussion/messageItem.html")

// DiscussionPageModel is a wrapper around da.DiscussionTableSelectPostByIDResult.
type DiscussionPageModel struct {
	da.DiscussionTableSelectItemByIDResult

	// Those props are used by template and not exposed in any API. No JSON keys attached.
	DiscussionURL   string
	UserHTML        string
	EID             string
	MessageListHTML string
	PageBarHTML     string
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
}

// NewDiscussionPageModel creates a DiscussionPageModel.
func NewDiscussionPageModel(p *da.DiscussionTableSelectItemByIDResult, msgListHTML string, pageBarHTML string) DiscussionPageModel {
	d := DiscussionPageModel{DiscussionTableSelectItemByIDResult: *p}
	eid := validator.EncodeID(p.ID)
	d.DiscussionURL = eid
	d.EID = validator.EncodeID(p.ID)
	d.UserHTML = rcom.GetUserItemViewHTML(p.UserID, p.UserName, p.UserIconName, eid, defs.Shared.EntityDiscussion, d.CreatedAt, d.ModifiedAt)
	d.MessageListHTML = msgListHTML
	d.PageBarHTML = pageBarHTML
	return d
}

// NewDiscussionMsgModel creates a DiscussionMsgModel.
func NewDiscussionMsgModel(p *da.DiscussionMsgTableSelectItemsByDiscussionResult) DiscussionMsgModel {
	d := DiscussionMsgModel{DiscussionMsgTableSelectItemsByDiscussionResult: *p}
	eid := validator.EncodeID(p.ID)
	d.DiscussionURL = app.URL.Discussion(p.ID)
	d.EID = eid
	d.UserHTML = rcom.GetUserItemViewHTML(p.UserID, p.UserName, p.UserIconName, eid, defs.Shared.EntityDiscussionMsg, d.CreatedAt, d.ModifiedAt)
	return d
}
