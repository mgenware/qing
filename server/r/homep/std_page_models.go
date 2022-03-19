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
	"qing/r/rcom"
)

var vStdPage = appHandler.MainPage().MustParseView("/home/stdPage.html")

// StdPageModel ...
type StdPageModel struct {
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
	d.HomePostsURL = appURL.Get().HomeAdv(appdef.KeyPosts, 1)
	d.HomeQuestionsURL = appURL.Get().HomeAdv(appdef.KeyQuestions, 1)
	d.HomeDiscussionsURL = appURL.Get().HomeAdv(appdef.KeyDiscussions, 1)
	return d
}
