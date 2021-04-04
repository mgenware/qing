/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appURL

import (
	"qing/app/appConfig"
	"qing/app/urlx"
)

var appURL *urlx.URL

func init() {
	conf := appConfig.Get()
	appURL = urlx.NewURL(conf)
}

func Get() *urlx.URL {
	return appURL
}
