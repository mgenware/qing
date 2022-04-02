/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package threadp

import (
	"qing/a/appHandler"
)

var vThreadPage = appHandler.MainPage().MustParseView("/thread/threadPage.html")

type ThreadPageModel struct {
	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	ThreadAppHTML     string
	ThreadMsgListHTML string
	PageBarHTML       string
}

func NewThreadPageModel(threadAppHTML, msgListHTML, pageBarHTML string) ThreadPageModel {
	d := ThreadPageModel{ThreadAppHTML: threadAppHTML, ThreadMsgListHTML: msgListHTML, PageBarHTML: pageBarHTML}
	return d
}
