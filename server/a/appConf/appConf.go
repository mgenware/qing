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
	"qing/a/config"
	"qing/a/def/infdef"
)

var conf *config.Config
var confPath string

func init() {
	if config.IsUT() {
		// Unit test mode.
		confPath = devConfigFile("ut")
	} else {
		devConfigName := os.Getenv(infdef.DevConfEnv)
		if devConfigName != "" {
			confPath = devConfigFile(devConfigName)
		} else {
			confPath = infdef.ConfigFile
		}
	}

	// Read config file
	conf = config.MustReadConfig(confPath)
}

func Get() *config.Config {
	return conf
}

func devConfigFile(name string) string {
	return filepath.Join(infdef.DevConfigDir, name+".json")
}
