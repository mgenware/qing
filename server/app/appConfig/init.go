/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConfig

import (
	"flag"
	"log"
	"os"
	"path/filepath"
	"qing/app/config"
	"qing/app/config/configs"
)

var conf *config.Config
var confPath string
var confDir string

func Get() *config.Config {
	return conf
}

func SetupConfig() *configs.SetupConfig {
	return Get().Setup
}

func init() {
	qTestEnv := os.Getenv("Q_TEST")
	confPath := qTestEnv

	if confPath == "" {
		// Parse command-line arguments
		flag.StringVar(&confPath, "config", "", "path of application config file")
		flag.Parse()

		// If `--config` is not specified, check if user has an extra argument like `go run main.go dev`, which we consider it as `--config "./userland/dev.json"`.
		userArgs := os.Args[1:]
		if len(userArgs) >= 1 {
			confPath = getDefaultConfigFilePath(userArgs[0] + ".json")
		} else {
			flag.PrintDefaults()
			os.Exit(1)
		}
	}

	// Read config file
	conf = config.MustReadConfig(confPath)
	confDir = filepath.Dir(confPath)

	// Since test config extends `dev.json`, we need to remove some dev-only fields.
	if qTestEnv != "" {
		conf.Debug = nil
	}

	log.Printf("✅ App config: Loaded at \"%v\"", confPath)
	if conf.TestMode {
		log.Printf("🟣 Application running in test mode")
	} else if conf.DevMode() {
		log.Printf("🟡 Application running in dev mode")
	}
}
