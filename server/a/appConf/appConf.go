/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConf

import (
	"os"
	"path/filepath"
	"qing/a/conf"
	"qing/a/def/infdef"
)

var config *conf.Config
var configPath string

func init() {
	if conf.IsUTEnv() {
		// Unit test mode.
		configPath = devConfigFile("ut")
	} else {
		devConfigName := os.Getenv(infdef.DevConfEnv)
		if devConfigName != "" {
			configPath = devConfigFile(devConfigName)
		} else {
			configPath = infdef.ConfigFile
		}
	}

	// Read config file
	config = conf.MustReadConfig(configPath)
}

func Get() *conf.Config {
	return config
}

func devConfigFile(name string) string {
	return filepath.Join(infdef.DevConfigDir, name+".json")
}
