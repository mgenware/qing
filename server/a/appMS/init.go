/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appMS

import (
	"qing/a/appLog"
	"qing/a/coreConfig"
	"qing/a/coretype"
)

var appMS coretype.CoreMemoryStore

func init() {
	conf := coreConfig.Get().Extern.Redis

	port := conf.Port
	appMS = newAppMS(port, conf.Logging)
	err := appMS.GetConn().Ping()
	if err != nil {
		panic(err)
	}
	appLog.Get().Info("app.ms.connected", "port", port)
}

func GetConn() coretype.CoreMemoryStoreConn {
	return appMS.GetConn()
}
