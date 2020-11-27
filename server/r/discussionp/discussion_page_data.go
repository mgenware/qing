package discussionp

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcm"
)

// DiscussionPageData is a wrapper around da.DiscussionTableSelectPostByIDResult.
type DiscussionPageData struct {
	da.DiscussionTableSelectItemByIDResult

	// Those props are used by template and not exposed in any API. No JSON keys attached.
	DiscussionURL   string
	UserHTML        string
	EID             string
	MessageListHTML string
	PageBarHTML     string
}

// DiscussionMsgData is a wrapper around da.DiscussionMsgTableSelectItemsByDiscussionResult.
type DiscussionMsgData struct {
	da.DiscussionMsgTableSelectItemsByDiscussionResult

	DiscussionURL string
	UserHTML      string
	EID           string
}

var vDiscussionPage = app.TemplateManager.MustParseView("/discussion/discussionPage.html")
var vMessageItem = app.TemplateManager.MustParseView("/discussion/messageItem.html")

// NewDiscussionPageData creates a DiscussionPageData.
func NewDiscussionPageData(p *da.DiscussionTableSelectItemByIDResult, msgListHTML string, pageBarHTML string) *DiscussionPageData {
	d := &DiscussionPageData{DiscussionTableSelectItemByIDResult: *p}
	eid := validator.EncodeID(p.ID)
	d.DiscussionURL = eid
	d.EID = validator.EncodeID(p.ID)
	d.UserHTML = rcm.GetUserItemViewHTML(p.UserID, p.UserName, p.UserIconName, eid, d.CreatedAt, d.ModifiedAt)
	d.MessageListHTML = msgListHTML
	d.PageBarHTML = pageBarHTML
	return d
}

// NewDiscussionMsgData creates a DiscussionMsgData.
func NewDiscussionMsgData(p *da.DiscussionMsgTableSelectItemsByDiscussionResult) *DiscussionMsgData {
	d := &DiscussionMsgData{DiscussionMsgTableSelectItemsByDiscussionResult: *p}
	eid := validator.EncodeID(p.ID)
	d.DiscussionURL = app.URL.Discussion(p.ID)
	d.EID = eid
	d.UserHTML = rcm.GetUserItemViewHTML(p.UserID, p.UserName, p.UserIconName, eid, d.CreatedAt, d.ModifiedAt)
	return d
}
