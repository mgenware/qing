/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConfig

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"qing/a/appEnv"
	"qing/a/cfgx"
	"qing/a/def/infraDef"
	"qing/lib/iolib"
	"sync"
)

var baseConfig *cfgx.AppConfig
var configPath string

var diskConfig *cfgx.AppConfig
var updateDiskConfigMutex *sync.Mutex
var diskConfigUpdated = false
var accessor *AppConfigAccessor

type UpdateDiskConfigFnType func(cfg *cfgx.AppConfig)

func init() {
	devConfigName := os.Getenv(infraDef.UserAppConfigNameEnv)
	if devConfigName != "" {
		configPath = devConfigFile(devConfigName)
	} else {
		configPath = infraDef.CoreConfigDataFile
	}

	// Read config file
	configBase := cfgx.MustReadConfig(configPath, infraDef.AppConfigDirName, func() cfgx.ConfigBase {
		return &cfgx.AppConfig{}
	})
	baseConfig = configBase.(*cfgx.AppConfig)
	if baseConfig == nil {
		panic(fmt.Errorf("config file %v is empty", configPath))
	}
	accessor = NewAppConfigAccessor(baseConfig)
	log.Print("AppConfig.init done")
}

func Get(r *http.Request) AppConfigAccessorBase {
	if appEnv.IsBR() {
		brAccessor := NewBrAppConfigAccessor(r, accessor)
		return brAccessor
	}
	return accessor
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
func BRDiskConfig() *cfgx.AppConfig {
	return diskConfig
}

func devConfigFile(name string) string {
	return filepath.Join(infraDef.DevConfigDir, infraDef.AppConfigDirName, name+".json")
}
