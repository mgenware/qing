/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appHandler

import (
	"qing/app/appConfig"
	"qing/app/appLog"
	"qing/app/handler"
	"qing/app/handler/assetmgr"
)

var mainPageManager *handler.MainPageManager

func init() {
	conf := appConfig.Get()
	logger := appLog.Get()

	templatesConfig := conf.Templates
	localizationConfig := conf.Localization
	assMgr := assetmgr.NewAssetsManager(conf.HTTP.Static.Dir, conf.Debug)
	mainPageManager = handler.MustCreateMainPageManager(templatesConfig.Dir, localizationConfig.Dir, assMgr, logger, conf)
}

func MainPage() *handler.MainPageManager {
	return mainPageManager
}
