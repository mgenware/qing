package threadp

import (
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

// ThreadPageData is a wrapper around da.ThreadTableSelectPostByIDResult.
type ThreadPageData struct {
	da.ThreadTableSelectPostByIDResult
	handler.LocalizedTemplateData

	// Those props are used by template and not exposed in any API. No JSON keys attached.
	ThreadURL   string
	UserEID     string
	UserURL     string
	UserIconURL string
	EID         string
}

// ThreadMsgData is a wrapper around da.ThreadMsgTableSelectPostByIDResult.
type ThreadMsgData struct {
	da.ThreadMsgTableSelectPostByIDResult
	handler.LocalizedTemplateData

	// Those props are used by template and not exposed in any API. No JSON keys attached.
	ThreadURL   string
	UserEID     string
	UserURL     string
	UserIconURL string
	EID         string
}

var vThreadPage = app.TemplateManager.MustParseLocalizedView("/thread/threadPage.html")
var vMessageItem = app.TemplateManager.MustParseLocalizedView("/thread/messageItem.html")

// NewThreadPageData creates a ThreadPageData.
func NewThreadPageData(p *da.ThreadTableSelectPostByIDResult) *ThreadPageData {
	d := &ThreadPageData{ThreadTableSelectPostByIDResult: *p}
	d.ThreadURL = app.URL.Thread(p.ID)
	d.UserEID = validator.EncodeID(p.UserID)
	d.UserURL = app.URL.UserProfile(p.UserID)
	d.UserIconURL = app.URL.UserIconURL50(p.UserID, p.UserIconName)
	d.EID = validator.EncodeID(p.ID)
	return d
}

// NewThreadMsgData creates a ThreadMsgData.
func NewThreadMsgData(p *da.ThreadMsgTableSelectPostByIDResult) *ThreadMsgData {
	d := &ThreadMsgData{ThreadMsgTableSelectPostByIDResult: *p}
	d.ThreadURL = app.URL.Thread(p.ID)
	d.UserEID = validator.EncodeID(p.UserID)
	d.UserURL = app.URL.UserProfile(p.UserID)
	d.UserIconURL = app.URL.UserIconURL50(p.UserID, p.UserIconName)
	d.EID = validator.EncodeID(p.ID)
	return d
}
