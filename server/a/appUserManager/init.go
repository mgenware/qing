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
	"qing/a/appURL"
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

	sessionMgr, err := userx.NewMemoryBasedSessionManager(
		logger, urlx)
	if err != nil {
		panic(err)
	}
	userManager = userx.NewUserManager(db, sessionMgr, mp, urlx, cc)
	if appEnv.IsUT() {
		for _, uid := range testAccounts {
			userManager.TestLogin(uid)
		}
	}
}

func Get() *userx.UserManager {
	return userManager
}
