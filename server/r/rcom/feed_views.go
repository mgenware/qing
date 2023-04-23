/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/da"
	"qing/lib/clib"
	"qing/sod/feedSod"
)

var vThreadFeedView = appHandler.MainPage().MustParseView("com/feed/threadFeedView.html")

type PostFeedData struct {
	da.HomePostItem
	feedSod.FeedBase
}

func NewPostFeedData(src *da.HomePostItem) PostFeedData {
	d := PostFeedData{HomePostItem: *src}

	// ContentBaseExtraProps
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	d.UserURL = appURL.Get().UserProfile(d.UserID)
	d.UserIconURL = appURL.Get().UserIconURL50(d.UserID, d.UserIconName)

	d.Link = appURL.Get().Post(d.ID)
	return d
}

type ThreadFeedData struct {
	da.ThreadFeedResult
	feedSod.FeedBase
}

func NewThreadFeedData(src *da.ThreadFeedResult) ThreadFeedData {
	d := ThreadFeedData{ThreadFeedResult: *src}

	// ContentBaseExtraProps
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	d.UserURL = appURL.Get().UserProfile(d.UserID)
	d.UserIconURL = appURL.Get().UserIconURL50(d.UserID, d.UserIconName)

	d.Link = appURL.Get().FPost(d.ID)
	return d
}

func MustRenderThreadFeedView(d *ThreadFeedData) string {
	return vThreadFeedView.MustExecuteToString(d)
}
