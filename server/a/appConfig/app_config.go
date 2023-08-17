/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConfig

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"qing/a/appEnv"
	"qing/a/appcm"
	"qing/a/cfgx"
	"qing/a/def/appDef"
	"qing/a/def/infraDef"
	"qing/lib/iolib"
	"sync"

	"github.com/imdario/mergo"
)

var baseConfig *cfgx.AppConfig
var configPath string

var diskConfig *cfgx.AppConfig
var updateDiskConfigMutex *sync.Mutex
var diskConfigUpdated = false

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
	log.Print("AppConfig.init done")
}

func Get(r *http.Request) *cfgx.AppConfig {
	if appEnv.IsBR() {
		var appCfgUpdateDict map[string]any
		acCookie, err := r.Cookie(appDef.AppConfigBrCookie)
		if err != nil && err != http.ErrNoCookie {
			appcm.PanicOn(err, "Failed to get app config BR cookie")
		}

		if acCookie != nil {
			err = json.Unmarshal([]byte(acCookie.Value), &appCfgUpdateDict)
			appcm.PanicOn(err, "Failed to parse app config BR cookie")
		}

		if appCfgUpdateDict == nil {
			return baseConfig
		}
		clone, err := baseConfig.CloneConfig()
		appcm.PanicOn(err, "Failed to clone app config")

		err = mergo.Map(&clone, appCfgUpdateDict)
		appcm.PanicOn(err, "Failed to merge app config")
		return clone
	}
	return baseConfig
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
