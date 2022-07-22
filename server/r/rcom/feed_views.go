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
	contentBaseSod "qing/sod/contentBase"
)

var vPostFeedView = appHandler.MainPage().MustParseView("com/feed/postFeedView.html")
var vThreadFeedView = appHandler.MainPage().MustParseView("com/feed/threadFeedView.html")

type PostFeedModel struct {
	da.HomeAGSelectPostsResult
	contentBaseSod.ContentBaseModelBase
}

func MustRenderPostFeedView(d *PostFeedModel) string {
	return vPostFeedView.MustExecuteToString(d)
}

func NewPostFeedModel(src *da.HomeAGSelectPostsResult) PostFeedModel {
	d := PostFeedModel{HomeAGSelectPostsResult: *src}

	// ContentBaseExtraProps
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	d.UserURL = appURL.Get().UserProfile(d.UserID)
	d.UserIconURL = appURL.Get().UserIconURL50(d.UserID, d.UserIconName)

	d.URL = appURL.Get().Post(d.ID)
	return d
}

type ThreadFeedModel struct {
	da.ThreadFeedResult
	contentBaseSod.ContentBaseModelBase
}

func NewThreadFeedModel(src *da.ThreadFeedResult) ThreadFeedModel {
	d := ThreadFeedModel{ThreadFeedResult: *src}

	// ContentBaseExtraProps
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	d.UserURL = appURL.Get().UserProfile(d.UserID)
	d.UserIconURL = appURL.Get().UserIconURL50(d.UserID, d.UserIconName)

	d.URL = appURL.Get().Thread(d.ID)
	return d
}

func MustRenderThreadFeedView(d *ThreadFeedModel) string {
	return vThreadFeedView.MustExecuteToString(d)
}
