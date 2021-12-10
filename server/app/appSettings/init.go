/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

import (
	"fmt"
	"log"
	"qing/app"
	"qing/sod/app/appRawSettings"
)

var appSettings *AppSettings
var needRestart bool

func init() {
	conf := app.CoreConfig()

	file := conf.AppSettings.File
	log.Printf("🚙 Loading app settings at \"%v\"", file)
	_, settings, err := getAppSettings(file)
	if err != nil {
		panic(fmt.Errorf("Error getting app settings, %v", err))
	}
	appSettings = settings
	log.Printf("✅ App settings: loaded at \"%v\"", file)
}

// Gets the app settings that are loaded when server starts.
func Get() *AppSettings {
	return appSettings
}

// Loads app settings from disk (settings on disk may need a server reboot
// to take effect).
func LoadFromDisk() (*appRawSettings.AppRawSettings, error) {
	conf := app.CoreConfig()

	file := conf.AppSettings.File
	settings, err := readAppSettingsObj(file)
	if err != nil {
		return nil, err
	}
	return settings, nil
}
