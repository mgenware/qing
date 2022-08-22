/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appDB

import (
	"database/sql"
	"qing/a/appConf"
	"qing/a/appLog"
	"qing/a/coretype"
)

var appDB coretype.CoreDB

func init() {
	conf := appConf.Get()

	appDB = newAppDB(conf)
	appLog.Get().Info("app.db.loaded")
}

func Get() coretype.CoreDB {
	return appDB
}

func DB() *sql.DB {
	return appDB.DB()
}
