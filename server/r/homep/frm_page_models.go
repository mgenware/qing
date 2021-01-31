package homep

import (
	"qing/app"
	"qing/da"
)

var vFrmPage = app.MainPageManager.MustParseView("/home/frmPage.html")
var vForumGroupView = app.MainPageManager.MustParseView("/home/forumGroupView.html")
var vForumView = app.MainPageManager.MustParseView("/home/forumView.html")

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
func NewForumGroupModel(d *da.HomeTableSelectForumGroupsResult, forumsHTML string) ForumGroupModel {
	r := ForumGroupModel{HomeTableSelectForumGroupsResult: *d}
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
	r.URL = app.URL.ForumAdv(d.ID, "", 1)
	return r
}

// NewFrmPageModel creates a new FrmPageModel.
func NewFrmPageModel(contentHTML string) *FrmPageModel {
	r := &FrmPageModel{}
	r.ContentHTML = contentHTML
	return r
}
