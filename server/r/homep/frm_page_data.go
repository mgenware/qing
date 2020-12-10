package homep

import (
	"qing/app"
	"qing/da"
)

var vFrmPage = app.MasterPageManager.MustParseView("/home/frmPage.html")
var vForumGroupView = app.MasterPageManager.MustParseView("/home/forumGroupView.html")
var vForumView = app.MasterPageManager.MustParseView("/home/forumView.html")

// FrmPageModel ...
type FrmPageModel struct {
	ContentHTML string
}

// ForumGroupModel wraps a da.HomeTableSelectForumGroupResult.
type ForumGroupModel struct {
	da.HomeTableSelectForumGroupsResult

	URL        string
	ForumsHTML string
}

// NewForumGroupModel creates a new ForumGroupModel.
func NewForumGroupModel(d *da.HomeTableSelectForumGroupsResult, forumsHTML string) *ForumGroupModel {
	r := &ForumGroupModel{HomeTableSelectForumGroupsResult: *d}
	r.URL = app.URL.ForumGroup(d.ID)
	r.ForumsHTML = forumsHTML
	return r
}

// ForumModel wraps a da.HomeTableSelectForumsResult.
type ForumModel struct {
	da.HomeTableSelectForumsResult

	URL string
}

// NewForumModel creates a new ForumModel.
func NewForumModel(d *da.HomeTableSelectForumsResult) *ForumModel {
	r := &ForumModel{HomeTableSelectForumsResult: *d}
	r.URL = app.URL.Forum(d.ID)
	return r
}

// NewFrmPageModel creates a new FrmPageModel.
func NewFrmPageModel(contentHTML string) *FrmPageModel {
	r := &FrmPageModel{}
	r.ContentHTML = contentHTML
	return r
}
