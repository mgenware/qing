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

	FeedListHTML  string
	PageBarHTML   string
	ForumEditable bool
	// "" If `ForumEditable` is false.
	ForumSettingsURL string
}

// NewForumPageModel creates a ForumPageModel.
func NewForumPageModel(f *da.ForumTableSelectForumResult, feedListHTML, pageBarHTML string, editable bool) ForumPageModel {
	d := ForumPageModel{ForumTableSelectForumResult: *f}

	fid := f.ID
	d.ForumURL = app.URL.ForumAdv(fid, "", 1)
	d.ForumQuestionsURL = app.URL.ForumAdv(fid, defs.Shared.KeyQuestions, 1)
	d.ForumDiscussionsURL = app.URL.ForumAdv(fid, defs.Shared.KeyDiscussions, 1)
	d.FeedListHTML = feedListHTML
	d.PageBarHTML = pageBarHTML
	d.ForumEditable = editable
	d.ForumSettingsURL = app.URL.ForumSettings(fid)
	return d
}
