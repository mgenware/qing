/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package coreConfig

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"qing/a/cfgx"
	"qing/a/def/infraDef"
	"qing/lib/iolib"
	"sync"
)

var config *cfgx.CoreConfig
var configPath string

var diskConfig *cfgx.CoreConfig
var updateDiskConfigMutex *sync.Mutex
var diskConfigUpdated = false

type UpdateDiskConfigFnType func(cfg *cfgx.CoreConfig)

func init() {
	updateDiskConfigMutex = &sync.Mutex{}
	devConfigName := os.Getenv(infraDef.UserCoreConfigNameEnv)
	if devConfigName != "" {
		configPath = devConfigFile(devConfigName)
	} else {
		configPath = infraDef.CoreConfigDataFile
	}

	// Read config file
	configBase := cfgx.MustReadConfig(configPath, infraDef.CoreConfigDirName, func() cfgx.ConfigBase {
		return &cfgx.CoreConfig{}
	})
	config = configBase.(*cfgx.CoreConfig)

	cloned, err := config.CloneConfig()
	if err != nil {
		panic(err)
	}
	diskConfig = cloned
	log.Print("CoreConfig.init done")
}

func Get() *cfgx.CoreConfig {
	return config
}

func UpdateDiskConfig(fn UpdateDiskConfigFnType) error {
	updateDiskConfigMutex.Lock()
	defer updateDiskConfigMutex.Unlock()

	fn(diskConfig)
	configBytes, err := json.Marshal(diskConfig)
	if err != nil {
		return err
	}
	err = iolib.WriteFile(infraDef.CoreConfigDataFile, configBytes)
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
func BRDiskConfig() *cfgx.CoreConfig {
	return diskConfig
}

func devConfigFile(name string) string {
	return filepath.Join(infraDef.DevConfigDir, infraDef.CoreConfigDirName, name+".json")
}
