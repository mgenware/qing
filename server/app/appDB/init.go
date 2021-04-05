/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appDB

import (
	"log"
	"qing/app"
	"qing/app/appConfig"
)

var appDB app.CoreDB

func init() {
	conf := appConfig.Get()

	if conf.IsUnitTesting {
		appDB = newTestDB()
	} else {
		appDB = newAppDB(conf)
		log.Printf("✅ App DB: Loaded")
	}
}

func Get() app.CoreDB {
	return appDB
}
