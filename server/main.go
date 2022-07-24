/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package main

import (
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appLog"
	"qing/a/appMS"
	"qing/a/appProfile"
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/appUserManager"
	"qing/a/config"
	"qing/r"
)

func main() {
	// Load core modules.
	conf := app.CoreConfig()
	logger := appLog.Get()

	if config.IsUT() {
		logger.Warn("🟣 app.running.ut")
	} else if conf.DevMode() {
		logger.Warn("🟡 app.running.dev")
	}

	// Start the main router.
	r.Start()

	// Preload core modules in production mode.
	if conf.ProductionMode() {
		appProfile.Get()
		appDB.Get()
		appMS.GetConn()
		appHandler.MainPage()
		appUserManager.Get()
		appURL.Get()
		appService.Get()
	}
}
