/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package homep

import (
	"qing/a/appHandler"
	"qing/r/rcom"
)

var vOnlymeFeedView = appHandler.MainPage().MustParseView("home/feed/onlymeFeedView.html")
var vUserFeedView = appHandler.MainPage().MustParseView("home/feed/userFeedView.html")
var vStdPage = appHandler.MainPage().MustParseView("home/stdPage.html")

type StdPageData struct {
	FeedListHTML   string
	PageBarHTML    string
	PaginationData *rcom.PaginationData
}

func NewStdPageData(pageData *rcom.PaginationData, feedHTML, pageBarHTML string) *StdPageData {
	d := &StdPageData{}
	d.FeedListHTML = feedHTML
	d.PaginationData = pageData
	d.PageBarHTML = pageBarHTML
	return d
}

func MustRenderOnlymeFeedView(d *rcom.PostFeedData) string {
	return vOnlymeFeedView.MustExecuteToString(d)
}

func MustRenderUserFeedView(d *rcom.PostFeedData) string {
	return vUserFeedView.MustExecuteToString(d)
}
