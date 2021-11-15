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
	log.Printf("✅ App MS: connected at \"%v\"", port)
}

func GetConn() app.CoreMemoryStoreConn {
	return appMS.GetConn()
}
