/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appProfile

import (
	"fmt"
	"qing/a/app"
	"qing/a/appLog"
	"qing/a/profile"
)

var appProfile *profile.AppProfile
var isNewProfile bool

func init() {
	conf := app.CoreConfig()

	dir := conf.AppProfile.Dir
	hasProfile, pro, err := profile.GetAppProfile(dir)
	if err != nil {
		panic(fmt.Errorf("error getting app profile, %v", err))
	}
	appProfile = pro
	isNewProfile = !hasProfile
	appLog.Get().Info("app.profile.loaded", "dir", dir)
}

func Get() *profile.AppProfile {
	return appProfile
}

func IsNewProfile() bool {
	return isNewProfile
}
