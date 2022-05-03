/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package homep

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/da"
)

var vFrmPage = appHandler.MainPage().MustParseView("/home/frmPage.html")
var vForumGroupView = appHandler.MainPage().MustParseView("/home/forumGroupView.html")
var vForumView = appHandler.MainPage().MustParseView("/home/forumView.html")

// FrmPageModel ...
type FrmPageModel struct {
	ContentHTML string
}

type ForumGroupModel struct {
	da.ForumHomeAGSelectForumGroupsResult

	URL        string
	ForumsHTML string
}

func NewForumGroupModel(d *da.ForumHomeAGSelectForumGroupsResult, forumsHTML string) ForumGroupModel {
	r := ForumGroupModel{ForumHomeAGSelectForumGroupsResult: *d}
	r.URL = appURL.Get().ForumGroup(d.ID)
	r.ForumsHTML = forumsHTML
	return r
}

type ForumModel struct {
	da.ForumHomeAGSelectForumsResult

	URL string
}

func NewForumModel(d *da.ForumHomeAGSelectForumsResult) *ForumModel {
	r := &ForumModel{ForumHomeAGSelectForumsResult: *d}
	r.URL = appURL.Get().ForumAdv(d.ID, 1)
	return r
}

func NewForumPageModel(contentHTML string) *FrmPageModel {
	r := &FrmPageModel{}
	r.ContentHTML = contentHTML
	return r
}
