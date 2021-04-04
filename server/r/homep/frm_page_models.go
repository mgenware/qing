/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package homep

import (
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/da"
)

var vFrmPage = appHandler.MainPage().MustParseView("/home/frmPage.html")
var vForumGroupView = appHandler.MainPage().MustParseView("/home/forumGroupView.html")
var vForumView = appHandler.MainPage().MustParseView("/home/forumView.html")

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
	r.URL = appURL.Get().ForumGroup(d.ID)
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
	r.URL = appURL.Get().ForumAdv(d.ID, "", 1)
	return r
}

// NewFrmPageModel creates a new FrmPageModel.
func NewFrmPageModel(contentHTML string) *FrmPageModel {
	r := &FrmPageModel{}
	r.ContentHTML = contentHTML
	return r
}
