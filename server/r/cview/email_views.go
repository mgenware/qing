/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package cview

import "qing/a/appHandler"

type EmailCommonLinkData struct {
	MainText string
	Link     string
}

var vEmailCommonLink = appHandler.EmailPage().MustParseView("commonLink.html")

func RenderEmailCommonLink(d *EmailCommonLinkData) string {
	return vEmailCommonLink.MustExecuteToString(d)
}
