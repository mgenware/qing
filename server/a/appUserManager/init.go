/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appUserManager

import (
	"qing/a/appDB"
	"qing/a/appEnv"
	"qing/a/appHandler"
	"qing/a/appLog"
	"qing/a/appMS"
	"qing/a/appURL"
	"qing/a/appcm"
	"qing/a/coreConfig"
	"qing/a/userx"
)

var userManager *userx.UserManager
var testAccounts = []uint64{101, 102}

func init() {
	cc := coreConfig.Get()
	logger := appLog.Get()
	urlx := appURL.Get()
	db := appDB.Get()
	mp := appHandler.MainPage()
	msConn := appMS.GetConn()

	sessionMgr, err := userx.NewSessionManager(
		msConn,
		logger,
		urlx)
	appcm.PanicOn(err)
	userManager, err = userx.NewUserManager(db, sessionMgr, mp, urlx, cc)
	appcm.PanicOn(err)
	if appEnv.IsUT() {
		for _, uid := range testAccounts {
			userManager.TestLogin(uid)
		}
	}
}

func Get() *userx.UserManager {
	return userManager
}
