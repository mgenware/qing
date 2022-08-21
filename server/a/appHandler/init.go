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
	"qing/a/config"
	"qing/a/handler"
	"qing/a/handler/localization"
)

var mainPageManager handler.CorePageManager
var emailPageManager *handler.EmailPageManager
var lsMgr localization.CoreManager

func MainPage() handler.CorePageManager {
	if mainPageManager == nil {
		mainPageManager = handler.MustCreateMainPageManager(app.CoreConfig(), appLog.Get(), LSManager())
	}
	return mainPageManager
}

func EmailPage() *handler.EmailPageManager {
	if emailPageManager == nil {
		emailPageManager = handler.MustCreateEmailPageManager(app.CoreConfig(), LSManager())
	}
	return emailPageManager
}

func LSManager() localization.CoreManager {
	if lsMgr == nil {
		lsMgr = mustCreateLSMgr(app.CoreConfig())
	}
	return lsMgr
}

func mustCreateLSMgr(conf *config.Config) localization.CoreManager {
	lsMgr, err := localization.NewManagerFromConfig(conf.Localization)
	if err != nil {
		panic(err)
	}
	return lsMgr
}
