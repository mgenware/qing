package homep

import (
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/r/rcom"
)

var vStdPage = app.MasterPageManager.MustParseLocalizedView("/home/stdPage.html")
var vStdThreadItem = app.MasterPageManager.MustParseView("/home/threadView.html")

// StdPageData ...
type StdPageData struct {
	handler.LocalizedTemplateData

	FeedListHTML string
	PageBarHTML  string
	PageData     *rcom.PageData

	HomePostsURL       string
	HomeQuestionsURL   string
	HomeDiscussionsURL string
}

// NewStdPageData creates a new StdPageData.
func NewStdPageData(pageData *rcom.PageData, feedHTML, pageBarHTML string) *StdPageData {
	d := &StdPageData{}
	d.FeedListHTML = feedHTML
	d.PageData = pageData
	d.PageBarHTML = pageBarHTML
	d.HomePostsURL = app.URL.HomeAdv(defs.Constants.KeyPosts, 1)
	d.HomeQuestionsURL = app.URL.HomeAdv(defs.Constants.KeyQuestions, 1)
	d.HomeDiscussionsURL = app.URL.HomeAdv(defs.Constants.KeyDiscussions, 1)
	return d
}
