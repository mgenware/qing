/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"qing/a/appHandler"
	"qing/da"
)

var vPostFeedView = appHandler.MainPage().MustParseView("/com/feed/postFeedView.html")
var vThreadFeedView = appHandler.MainPage().MustParseView("/com/feed/threadFeedView.html")

type PostFeedModel struct {
	da.HomeTableSelectPostsResult
	ContentBasePubProps
}

type ThreadFeedModel struct {
	da.ThreadFeedInterface
	ContentBasePubProps
}
