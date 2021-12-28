/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appMS

import (
	"qing/app"
	"qing/app/appLog"
)

var appMS app.CoreMemoryStore

func init() {
	conf := app.CoreConfig()

	port := conf.Extern.Redis.Port
	appMS = newAppMS(port)
	err := appMS.GetConn().Ping()
	if err != nil {
		panic(err)
	}
	appLog.Get().Info("App MS connected", port)
}

func GetConn() app.CoreMemoryStoreConn {
	return appMS.GetConn()
}
