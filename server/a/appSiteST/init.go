/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSiteST

import (
	"fmt"
	"qing/a/def/infdef"
	"qing/a/sitest"
	"qing/lib/iolib"
	"sync"
)

var memoryST *sitest.SiteSettings
var diskST *sitest.SiteSettings

// When writing or reading disk config. Use this mutex to ensure operations are thread-safe.
var diskMutex *sync.Mutex
var needRestart bool

func init() {
	diskMutex = &sync.Mutex{}

	st, err := sitest.ReadSiteSettings(infdef.SiteSettingsFile)
	if err != nil {
		panic(err)
	}
	memoryST = st

	copied, err := deepCopyConfig(st)
	if err != nil {
		panic(fmt.Errorf("error cloning config: %v", err))
	}
	diskST = copied
}

func Get() *sitest.SiteSettings {
	return memoryST
}

func GetNeedRestart() bool {
	return needRestart
}

func DiskMutex() *sync.Mutex {
	return diskMutex
}

// Unsafe: you have to wrap it inside `DiskMutex`.
func DiskConfigUnsafe() *sitest.SiteSettings {
	return diskST
}

// Unsafe: you have to wrap it inside `DiskMutex`.
func UpdateDiskConfigUnsafe(c *sitest.SiteSettings) error {
	configBytes, err := serializeConfig(c)
	if err != nil {
		return err
	}
	err = iolib.WriteFile(infdef.ConfigFile, configBytes)
	if err != nil {
		return err
	}

	needRestart = true
	diskST = c
	return nil
}
