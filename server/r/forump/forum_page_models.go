package forump

import (
	"qing/app"
	"qing/app/defs"
	"qing/da"
)

var vForumPage = app.MasterPageManager.MustParseView("/forum/forumPage.html")

// ForumPageModel wraps a da.ForumTableSelectForumResult.
type ForumPageModel struct {
	da.ForumTableSelectForumResult

	ForumURL            string
	ForumQuestionsURL   string
	ForumDiscussionsURL string

	FeedListHTML string
	PageBarHTML  string
}

// NewForumPageModel creates a ForumPageModel.
func NewForumPageModel(f *da.ForumTableSelectForumResult, feedListHTML, pageBarHTML string) *ForumPageModel {
	d := &ForumPageModel{ForumTableSelectForumResult: *f}

	fid := f.ID
	d.ForumURL = app.URL.ForumAdv(fid, "", 1)
	d.ForumQuestionsURL = app.URL.ForumAdv(fid, defs.Constants.KeyQuestions, 1)
	d.ForumDiscussionsURL = app.URL.ForumAdv(fid, defs.Constants.KeyDiscussions, 1)
	d.FeedListHTML = feedListHTML
	d.PageBarHTML = pageBarHTML
	return d
}
