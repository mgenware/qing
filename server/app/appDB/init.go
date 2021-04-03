/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appDB

import (
	"qing/app"
	"qing/app/appConfig"
)

var appDB app.CoreDB

func init() {
	conf := appConfig.Get()
	appDB = newAppDBImpl(conf)
}

func Get() app.CoreDB {
	return appDB
}
