package postp

import (
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

// ThreadPageData is a wrapper around da.ThreadTableSelectThreadByIDResult.
type ThreadPageData struct {
	da.PostTableSelectPostByIDResult
	handler.LocalizedTemplateData

	// Those props are used by template and not exposed in any API. No JSON keys attached.
	ThreadURL   string
	UserEID     string
	UserURL     string
	UserIconURL string
	EID         string
	Liked       bool
}

var vThreadPage = app.TemplateManager.MustParseLocalizedView("/thread/threadPage.html")

// NewThreadPageData creates a ThreadPageData.
func NewThreadPageData(p *da.ThreadTableSelectThreadByIDResult) *ThreadPageData {
	d := &ThreadPageData{ThreadTableSelectThreadByIDResult: *p}
	d.ThreadURL = app.URL.Thread(p.ID)
	d.UserEID = validator.EncodeID(p.UserID)
	d.UserURL = app.URL.UserProfile(p.UserID)
	d.UserIconURL = app.URL.UserIconURL50(p.UserID, p.UserIconName)
	d.EID = validator.EncodeID(p.ID)
	return d
}
