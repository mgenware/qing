package discussionp

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
)

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

// DiscussionMsgModel is a wrapper around da.DiscussionMsgTableSelectItemsByDiscussionResult.
type DiscussionMsgModel struct {
	da.DiscussionMsgTableSelectItemsByDiscussionResult

	DiscussionURL string
	UserHTML      string
	EID           string
}

var vDiscussionPage = app.MasterPageManager.MustParseView("/discussion/discussionPage.html")
var vMessageItem = app.MasterPageManager.MustParseView("/discussion/messageItem.html")

// NewDiscussionPageModel creates a DiscussionPageModel.
func NewDiscussionPageModel(p *da.DiscussionTableSelectItemByIDResult, msgListHTML string, pageBarHTML string) *DiscussionPageModel {
	d := &DiscussionPageModel{DiscussionTableSelectItemByIDResult: *p}
	eid := validator.EncodeID(p.ID)
	d.DiscussionURL = eid
	d.EID = validator.EncodeID(p.ID)
	d.UserHTML = rcom.GetUserItemViewHTML(p.UserID, p.UserName, p.UserIconName, eid, d.CreatedAt, d.ModifiedAt)
	d.MessageListHTML = msgListHTML
	d.PageBarHTML = pageBarHTML
	return d
}

// NewDiscussionMsgModel creates a DiscussionMsgModel.
func NewDiscussionMsgModel(p *da.DiscussionMsgTableSelectItemsByDiscussionResult) *DiscussionMsgModel {
	d := &DiscussionMsgModel{DiscussionMsgTableSelectItemsByDiscussionResult: *p}
	eid := validator.EncodeID(p.ID)
	d.DiscussionURL = app.URL.Discussion(p.ID)
	d.EID = eid
	d.UserHTML = rcom.GetUserItemViewHTML(p.UserID, p.UserName, p.UserIconName, eid, d.CreatedAt, d.ModifiedAt)
	return d
}
