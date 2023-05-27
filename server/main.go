/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package main

import (
	"log"
	"qing/a/appDB"
	"qing/a/appEnv"
	"qing/a/appHandler"
	"qing/a/appLog"
	"qing/a/appMS"
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/appUserManager"
	"qing/a/coreConfig"
	"qing/r"
)

func main() {
	// Load core modules.
	config := coreConfig.Get()
	logger := appLog.Get()

	if appEnv.IsUT() {
		logger.Warn("🟣 app.running.ut")
	} else if appEnv.IsBR() {
		// `logger` is muted in BR mode.
		log.Print("🔵 app.running.br")
	} else if config.DevMode() {
		logger.Warn("🟡 app.running.dev")
	}

	// Start the main router.
	r.Start()

	// Preload core modules in production mode.
	if config.ProductionMode() {
		appDB.Get()
		appMS.GetConn()
		appHandler.MainPage()
		appUserManager.Get()
		appURL.Get()
		appService.Get()
	}
}
