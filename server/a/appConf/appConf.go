/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConf

import (
	"fmt"
	"os"
	"path/filepath"
	"qing/a/config"
	"qing/a/def/infdef"
	"qing/lib/iolib"
	"sync"
)

var runningConfig *config.Config
var diskConfig *config.Config
var confPath string

// When writing or reading disk config. Use this mutex to ensure operations are thread-safe.
var diskMutex *sync.Mutex
var needRestart bool

func init() {
	diskMutex = &sync.Mutex{}

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
	runningConfig = config.MustReadConfig(confPath)
	copied, err := deepCopyConfig(runningConfig)
	if err != nil {
		panic(fmt.Errorf("error cloning config: %v", err))
	}
	diskConfig = copied
}

func Get() *config.Config {
	return runningConfig
}

func GetNeedRestart() bool {
	return needRestart
}

func DiskMutex() *sync.Mutex {
	return diskMutex
}

// Unsafe: you have to wrap it inside `DiskMutex`.
func DiskConfigUnsafe() *config.Config {
	return diskConfig
}

// Unsafe: you have to wrap it inside `DiskMutex`.
func UpdateDiskConfigUnsafe(c *config.Config) error {
	configBytes, err := serializeConfig(c)
	if err != nil {
		return err
	}
	err = iolib.WriteFile(infdef.ConfigFile, configBytes)
	if err != nil {
		return err
	}

	needRestart = true
	diskConfig = c
	return nil
}

func devConfigFile(name string) string {
	return filepath.Join(infdef.DevConfigDir, name+".json")
}
