/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appUserManager

import (
	"qing/app/appConfig"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appLog"
	"qing/app/appMS"
	"qing/app/appURL"
	"qing/app/userx"
)

var userManager *userx.UserManager

func init() {
	conf := appConfig.Get()
	setupConf := appConfig.SetupConfig()
	msConn := appMS.GetConn()
	logger := appLog.Get()
	urlx := appURL.Get()
	db := appDB.Get()
	mp := appHandler.MainPage()

	sessionMgr, err := userx.NewRedisBasedSessionManager(msConn,
		logger, urlx)
	if err != nil {
		panic(err)
	}
	userManager = userx.NewUserManager(db, sessionMgr, mp, urlx, setupConf.ForumsMode, conf.Debug)
}

func Get() *userx.UserManager {
	return userManager
}
