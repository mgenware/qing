/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appMS

import (
	"log"
	"qing/app"
	"qing/app/appConfig"
)

var appMS app.CoreMemoryStore

func init() {
	conf := appConfig.Get()

	port := conf.Extern.Redis.Port
	appMS = newAppMS(port)
	log.Printf("✅ App MS: connected at \"%v\"", port)
}

func Get() app.CoreMemoryStore {
	return appMS
}

func GetConn() app.CoreMemoryStoreConn {
	return Get().GetConn()
}
