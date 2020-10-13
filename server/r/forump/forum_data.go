package forump

import (
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

// ForumGroupData is a wrapper around ForumGroupTableSelectForumGroupResult.
type ForumGroupData struct {
	da.ForumGroupTableSelectForumGroupResult
	handler.LocalizedTemplateData

	EID string
}

func NewForumGroupData(d *da.ForumGroupTableSelectForumGroupResult) *ForumGroupData {
	r := &ForumGroupData{ForumGroupTableSelectForumGroupResult: *d}
	r.EID = validator.EncodeID(d.ID)
}

type ForumData struct {
	da.ForumGroupTableSelectForumGroupsResult
	handler.LocalizedTemplateData

	EID         string
	Link        string
	PostsString string
}

func NewForumData(p *da.ForumData) *ForumData {
	d := &ForumData{PostTableSelectPostByIDResult: *p}
	d.EID = validator.EncodeID(p.ID)
	d.UserURL = app.URL.UserProfile(p.UserID)
	d.UserIconURL = app.URL.UserIconURL50(p.UserID, p.UserIconName)
	d.EID = validator.EncodeID(p.ID)
	return d
}

type ForumGroupData struct {
	da.ForumGroupTableSelectForumGroupResult
	handler.LocalizedTemplateData

	EID string
}

var vForumView = app.TemplateManager.MustParseLocalizedView("/forum/forumView.html")
var vForumGroupView = app.TemplateManager.MustParseLocalizedView("/forum/forumGroupView.html")
var vForumHome = app.TemplateManager.MustParseLocalizedView("/forum/home.html")
