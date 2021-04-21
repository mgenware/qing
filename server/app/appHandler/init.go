/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appHandler

import (
	"log"
	"qing/app/appConfig"
	"qing/app/appLog"
	"qing/app/handler"
)

var mainPageManager handler.CorePageManager

func init() {
	conf := appConfig.Get()
	logger := appLog.Get()

	mainPageManager = handler.MustCreateMainPageManager(conf, logger)
	log.Printf("✅ App handler: Loaded at \"%v\"", conf.Templates.Dir)
}

func MainPage() handler.CorePageManager {
	return mainPageManager
}
