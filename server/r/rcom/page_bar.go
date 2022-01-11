/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import "qing/a/appHandler"

var vPageBar = appHandler.MainPage().MustParseView("/com/pageBar.html")

// GetPageBarHTML returns page bar HTML with the given params.
func GetPageBarHTML(pageData *PageData) string {
	return vPageBar.MustExecuteToString(pageData)
}
