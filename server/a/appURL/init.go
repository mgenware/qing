/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appURL

import (
	"qing/a/coreConfig"
	"qing/a/urlx"
)

var appURL *urlx.URL

func init() {
	cc := coreConfig.Get()
	appURL = urlx.NewURL(cc)
}

func Get() *urlx.URL {
	return appURL
}
