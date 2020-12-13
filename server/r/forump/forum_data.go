package forump

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
)

type ForumData struct {
	da.ForumTableSelectForumResult

	ForumURL            string
	ForumQuestionsURL   string
	ForumDiscussionsURL string

	FeedListHTML string
	PageBarHTML  string
}

func NewForumData(p *da.ForumData) *ForumData {
	d := &ForumData{PostTableSelectPostByIDResult: *p}
	d.EID = validator.EncodeID(p.ID)
	d.UserURL = app.URL.UserProfile(p.UserID)
	d.UserIconURL = app.URL.UserIconURL50(p.UserID, p.UserIconName)
	d.EID = validator.EncodeID(p.ID)
	return d
}

var vForumPage = app.MasterPageManager.MustParseView("/forum/forumPage.html")
