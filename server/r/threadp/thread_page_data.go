package threadp

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcm"
)

// ThreadPageData is a wrapper around da.ThreadTableSelectPostByIDResult.
type ThreadPageData struct {
	da.ThreadTableSelectItemByIDResult

	// Those props are used by template and not exposed in any API. No JSON keys attached.
	ThreadURL       string
	UserHTML        string
	EID             string
	MessageListHTML string
	PageBarHTML     string
}

// ThreadMsgData is a wrapper around da.ThreadMsgTableSelectItemsByThreadResult.
type ThreadMsgData struct {
	da.ThreadMsgTableSelectItemsByThreadResult

	ThreadURL string
	UserHTML  string
	EID       string
}

var vThreadPage = app.TemplateManager.MustParseView("/thread/threadPage.html")
var vMessageItem = app.TemplateManager.MustParseView("/thread/messageItem.html")

// NewThreadPageData creates a ThreadPageData.
func NewThreadPageData(p *da.ThreadTableSelectItemByIDResult, msgListHTML string, pageBarHTML string) *ThreadPageData {
	d := &ThreadPageData{ThreadTableSelectItemByIDResult: *p}
	eid := validator.EncodeID(p.ID)
	d.ThreadURL = eid
	d.EID = validator.EncodeID(p.ID)
	d.UserHTML = rcm.GetUserItemViewHTML(p.UserID, p.UserName, p.UserIconName, eid, d.CreatedAt, d.ModifiedAt)
	d.MessageListHTML = msgListHTML
	d.PageBarHTML = pageBarHTML
	return d
}

// NewThreadMsgData creates a ThreadMsgData.
func NewThreadMsgData(p *da.ThreadMsgTableSelectItemsByThreadResult) *ThreadMsgData {
	d := &ThreadMsgData{ThreadMsgTableSelectItemsByThreadResult: *p}
	eid := validator.EncodeID(p.ID)
	d.ThreadURL = app.URL.Thread(p.ID)
	d.EID = eid
	d.UserHTML = rcm.GetUserItemViewHTML(p.UserID, p.UserName, p.UserIconName, eid, d.CreatedAt, d.ModifiedAt)
	return d
}
