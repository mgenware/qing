/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

import (
	"fmt"
	"qing/a/appConf"
	"qing/a/appLog"
	appSod "qing/sod/app"
)

var appSettings *AppSettings
var needRestart bool

func init() {
	conf := appConf.Get()

	file := conf.AppSettings.File
	_, settings, err := getAppSettings(file)
	if err != nil {
		panic(fmt.Errorf("error getting app settings, %v", err))
	}
	appSettings = settings
	appLog.Get().Info("app.settings.loaded", "file", file)
}

// Gets the app settings that are loaded when server starts.
func Get() *AppSettings {
	return appSettings
}

// Loads app settings from disk (settings on disk may need a server reboot
// to take effect).
func LoadFromDisk() (*appSod.AppRawSettings, error) {
	conf := appConf.Get()

	file := conf.AppSettings.File
	settings, err := readAppSettingsObj(file)
	if err != nil {
		return nil, err
	}
	return settings, nil
}
