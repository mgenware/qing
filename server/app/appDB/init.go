/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appDB

import (
	"database/sql"
	"log"
	"qing/app"
)

var appDB app.CoreDB

func init() {
	conf := app.CoreConfig()

	appDB = newAppDB(conf)
	log.Printf("✅ App DB: Loaded")
}

func Get() app.CoreDB {
	return appDB
}

func DB() *sql.DB {
	return appDB.DB()
}
