/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import "qing/app"

var vNoContentView = app.MainPageManager.MustParseView("/com/noContentView.html")

// MustRunNoContentViewTemplate executes vNoContentView to string, and panics if any error happened.
func MustRunNoContentViewTemplate() string {
	return vNoContentView.MustExecuteToString(nil)
}
