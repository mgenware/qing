/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

import (
	"qing/a/app"
	"qing/a/appLog"
	"qing/lib/iolib"
	appSod "qing/sod/app"

	"github.com/mgenware/goutil/iox"
)

// Gets whether disk settings are changed. This value is reset when server is restarted.
func NeedRestart() bool {
	return needRestart
}

// Called by `update_settings` API. Calling this func always results in
// `needRestart` to be set to true.
func WriteAppSettings(settings *appSod.AppRawSettings) error {
	conf := app.CoreConfig()

	file := conf.AppSettings.File
	err := writeAppSettingsObj(settings, file)
	if err != nil {
		needRestart = true
	}
	return err
}

func readAppSettingsObj(file string) (*appSod.AppRawSettings, error) {
	var settings appSod.AppRawSettings
	err := iolib.ReadJSONFile(file, &settings)
	if err != nil {
		return nil, err
	}
	return &settings, nil
}

func writeAppSettingsObj(settings *appSod.AppRawSettings, path string) error {
	appLog.Get().Info("app.settings.writing", "path", path)
	return iolib.WriteJSONFile(path, settings)
}

func newAppSettingsObj() *appSod.AppRawSettings {
	st := &appSod.AppRawSettings{}
	return st
}

// Loads app settings from the given path, and creates one if it
// does not exist.
func getAppSettings(file string) (bool, *AppSettings, error) {
	// Creates a new app settings if it does not exist.
	hasAppSettings, err := iox.FileExists(file)
	if err != nil {
		return false, nil, err
	}
	if !hasAppSettings {
		newSettings := newAppSettingsObj()
		err := writeAppSettingsObj(newSettings, file)
		if err != nil {
			return false, nil, err
		}
		return false, NewAppSettings(newSettings), nil
	}
	settings, err := readAppSettingsObj(file)
	if err != nil {
		return false, nil, err
	}
	return hasAppSettings, NewAppSettings(settings), nil
}
