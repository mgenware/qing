/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appHandler

import (
	"qing/a/appConf"
	"qing/a/appLog"
	"qing/a/appSiteST"
	"qing/a/handler"
	"qing/a/handler/localization"
	"qing/a/sitest"
)

var mainPageManager handler.CorePageManager
var emailPageManager *handler.EmailPageManager
var lsMgr localization.CoreManager

func MainPage() handler.CorePageManager {
	if mainPageManager == nil {
		mainPageManager = handler.MustCreateMainPageManager(appConf.Get(), appSiteST.Get(), appLog.Get(), LSManager())
	}
	return mainPageManager
}

func EmailPage() *handler.EmailPageManager {
	if emailPageManager == nil {
		emailPageManager = handler.MustCreateEmailPageManager(appConf.Get(), LSManager())
	}
	return emailPageManager
}

func LSManager() localization.CoreManager {
	if lsMgr == nil {
		lsMgr = mustCreateLSMgr(appSiteST.Get())
	}
	return lsMgr
}

func mustCreateLSMgr(siteSettings *sitest.SiteSettings) localization.CoreManager {
	lsMgr, err := localization.NewManagerFromConfig(siteSettings)
	if err != nil {
		panic(err)
	}
	return lsMgr
}
