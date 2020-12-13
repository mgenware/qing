package homep

import (
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/r/rcom"
)

var vStdPage = app.MasterPageManager.MustParseLocalizedView("/home/stdPage.html")

// StdPageModel ...
type StdPageModel struct {
	handler.LocalizedTemplateData

	FeedListHTML string
	PageBarHTML  string
	PageData     *rcom.PageData

	HomePostsURL       string
	HomeQuestionsURL   string
	HomeDiscussionsURL string
}

// NewStdPageModel creates a new StdPageModel.
func NewStdPageModel(pageData *rcom.PageData, feedHTML, pageBarHTML string) *StdPageModel {
	d := &StdPageModel{}
	d.FeedListHTML = feedHTML
	d.PageData = pageData
	d.PageBarHTML = pageBarHTML
	d.HomePostsURL = app.URL.HomeAdv(defs.Constants.KeyPosts, 1)
	d.HomeQuestionsURL = app.URL.HomeAdv(defs.Constants.KeyQuestions, 1)
	d.HomeDiscussionsURL = app.URL.HomeAdv(defs.Constants.KeyDiscussions, 1)
	return d
}
