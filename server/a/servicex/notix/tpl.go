/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package notix

import (
	"qing/a/appHandler"
)

var vDefaultTemplate = appHandler.EmailPage().MustParseView("noti/tplDefault.html")

type DefaultTemplateData struct {
	Desc     string
	LinkText string
	Link     string
}
