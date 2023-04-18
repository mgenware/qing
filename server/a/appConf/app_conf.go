/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConf

import (
	"encoding/json"
	"os"
	"path/filepath"
	"qing/a/conf"
	"qing/a/def/infdef"
	"qing/lib/iolib"
	"sync"
)

var config *conf.Config
var configPath string

var diskConfig *conf.Config
var updateDiskConfigMutex *sync.Mutex
var diskConfigUpdated = false

func init() {
	updateDiskConfigMutex = &sync.Mutex{}
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

	// Read another copy to `diskConfig`.
	diskConfig = conf.MustReadConfig(configPath)
}

func Get() *conf.Config {
	return config
}

type UpdateDiskConfigFnType func(cfg *conf.Config)

func UpdateDiskConfig(fn UpdateDiskConfigFnType) error {
	updateDiskConfigMutex.Lock()
	defer updateDiskConfigMutex.Unlock()

	fn(diskConfig)
	configBytes, err := json.Marshal(diskConfig)
	if err != nil {
		return err
	}
	err = iolib.WriteFile(infdef.ConfigFile, configBytes)
	if err != nil {
		return err
	}

	diskConfigUpdated = true
	return nil
}

func DiskConfigUpdated() bool {
	return diskConfigUpdated
}

// Only used in BR.
func BRDiskConfig() *conf.Config {
	return diskConfig
}

func devConfigFile(name string) string {
	return filepath.Join(infdef.DevConfigDir, name+".json")
}
