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

var vFrmPage = appHandler.MainPage().MustParseView("home/frmPage.html")
var vForumGroupView = appHandler.MainPage().MustParseView("home/forumGroupView.html")
var vForumView = appHandler.MainPage().MustParseView("home/forumView.html")

type FrmPageData struct {
	ContentHTML string
}

type ForumGroupData struct {
	da.ForumHomeAGSelectForumGroupsResult

	URL        string
	ForumsHTML string
}

func NewForumGroupData(d *da.ForumHomeAGSelectForumGroupsResult, forumsHTML string) ForumGroupData {
	r := ForumGroupData{ForumHomeAGSelectForumGroupsResult: *d}
	r.URL = appURL.Get().ForumGroup(d.ID)
	r.ForumsHTML = forumsHTML
	return r
}

type ForumData struct {
	da.ForumHomeAGSelectForumsResult

	URL string
}

func NewForumData(d *da.ForumHomeAGSelectForumsResult) *ForumData {
	r := &ForumData{ForumHomeAGSelectForumsResult: *d}
	r.URL = appURL.Get().ForumAdv(d.ID, 1)
	return r
}

func NewForumPageData(contentHTML string) *FrmPageData {
	r := &FrmPageData{}
	r.ContentHTML = contentHTML
	return r
}
