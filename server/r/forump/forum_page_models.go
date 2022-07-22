/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/da"
	"qing/lib/clib"
)

var vForumPage = appHandler.MainPage().MustParseView("forum/forumPage.html")

type ForumPageModel struct {
	da.ForumAGSelectForumResult

	ForumEID string
	ForumURL string

	FeedListHTML  string
	PageBarHTML   string
	ForumEditable bool
	// "" If `ForumEditable` is false.
	ForumSettingsURL string
}

// ForumPageWindData ...
type ForumPageWindData struct {
	FID      string
	Editable bool
}

// NewForumPageModel creates a ForumPageModel.
func NewForumPageModel(f *da.ForumAGSelectForumResult, feedListHTML, pageBarHTML string, editable bool) ForumPageModel {
	d := ForumPageModel{ForumAGSelectForumResult: *f}

	fid := f.ID
	d.ForumEID = clib.EncodeID(fid)
	d.ForumURL = appURL.Get().ForumAdv(fid, 1)
	d.FeedListHTML = feedListHTML
	d.PageBarHTML = pageBarHTML
	d.ForumEditable = editable
	d.ForumSettingsURL = appURL.Get().ForumSettings(fid)
	return d
}
