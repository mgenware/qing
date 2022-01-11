/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appURL

import (
	"qing/a/urlx"
	"qing/app"
)

var appURL *urlx.URL

func init() {
	conf := app.CoreConfig()
	appURL = urlx.NewURL(conf)
}

func Get() *urlx.URL {
	return appURL
}
