/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appHandler

import (
	"qing/a/app"
	"qing/a/appLog"
	"qing/a/handler"
)

var mainPageManager handler.CorePageManager
var emailPageManager *handler.EmailPageManager

func init() {
	conf := app.CoreConfig()
	logger := appLog.Get()

	mainPageManager = handler.MustCreateMainPageManager(conf, logger)
	emailPageManager = handler.MustCreateEmailPageManager(conf)
	appLog.Get().Info("app.handler.loaded", "tplDir", conf.Templates.Dir)
}

func MainPage() handler.CorePageManager {
	return mainPageManager
}

func EmailPage() *handler.EmailPageManager {
	return emailPageManager
}
