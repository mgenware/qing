/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package main

import (
	"log"
	"qing/a/appConf"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appLog"
	"qing/a/appMS"
	"qing/a/appProfile"
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/appUserManager"
	"qing/a/conf"
	"qing/r"
)

func main() {
	// Load core modules.
	config := appConf.Get()
	logger := appLog.Get()

	if conf.IsUTEnv() {
		logger.Warn("🟣 app.running.ut")
	} else if conf.IsBREnv() {
		// `logger` is muted in BR mode.
		log.Print("🔵 app.running.br")
	} else if config.DevMode() {
		logger.Warn("🟡 app.running.dev")
	}

	// Start the main router.
	r.Start()

	// Preload core modules in production mode.
	if config.ProductionMode() {
		appProfile.Get()
		appDB.Get()
		appMS.GetConn()
		appHandler.MainPage()
		appUserManager.Get()
		appURL.Get()
		appService.Get()
	}
}
