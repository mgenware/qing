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
	"qing/lib/iolib"

	"github.com/mgenware/goutil/iox"
)

var appSettings *AppSettings

func init() {
	conf := app.CoreConfig()

	file := conf.AppSettings.File
	_, settings, err := GetAppSettings(file)
	if err != nil {
		panic(fmt.Errorf("Error getting app settings, %v", err))
	}
	appSettings = settings
	log.Printf("✅ App settings: loaded at \"%v\"", file)
}

func Get() *AppSettings {
	return appSettings
}

func readAppSettingsCore(file string) (*AppSettings, error) {
	log.Printf("🚙 Loading app settings at \"%v\"", file)
	var settings AppSettings
	err := iolib.ReadJSONFile(file, &settings)
	if err != nil {
		return nil, err
	}
	return &settings, nil
}

func writeAppSettings(settings *AppSettings, path string) error {
	log.Printf("🚗 Writing app settings to \"%v\"", path)
	return iolib.WriteJSONFile(path, settings)
}

func newAppSettings() *AppSettings {
	profile := &AppSettings{
		Forums: &ForumsSettings{},
	}
	return profile
}

// GetAppSettings loads app settings from the given path, and creates one if it
// does not exist.
func GetAppSettings(file string) (bool, *AppSettings, error) {
	// Creates a new app settings if it does not exist.
	hasAppSettings, err := iox.FileExists(file)
	if err != nil {
		return false, nil, err
	}
	if !hasAppSettings {
		newSettings := newAppSettings()
		err := writeAppSettings(newSettings, file)
		if err != nil {
			return false, nil, err
		}
		return false, newSettings, nil
	}
	settings, err := readAppSettingsCore(file)
	if err != nil {
		return false, nil, err
	}
	return hasAppSettings, settings, nil
}
