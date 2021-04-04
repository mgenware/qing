/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appProfile

import (
	"fmt"
	"log"
	"qing/app/appConfig"
	"qing/app/profile"
)

var appProfile *profile.AppProfile

func init() {
	conf := appConfig.Get()

	dir := conf.AppProfile.Dir
	pro, err := profile.GetAppProfile(dir)
	if err != nil {
		panic(fmt.Errorf("Error getting app profile, %v", err))
	}
	appProfile = pro
	log.Printf("✅ App profile: loaded at \"%v\"", dir)
}

func Get() *profile.AppProfile {
	return appProfile
}
