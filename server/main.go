/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package main

import (
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appLog"
	"qing/app/appMS"
	"qing/app/appProfile"
	"qing/app/appService"
	"qing/app/appURL"
	"qing/app/appUserManager"
	"qing/r"
)

func main() {
	r.Start()
	conf := app.CoreConfig()

	// Preload core modules in production mode.
	if conf.ProductionMode() {
		appProfile.Get()
		appLog.Get()
		appDB.Get()
		appMS.GetConn()
		appHandler.MainPage()
		appUserManager.Get()
		appURL.Get()
		appService.Get()
	}
}
