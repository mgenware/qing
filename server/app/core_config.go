/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package app

import (
	"flag"
	"log"
	"os"
	"path/filepath"
	"qing/app/config"
)

var conf *config.Config
var confPath string

func CoreConfig() *config.Config {
	return conf
}

func init() {
	if confPath == "" {
		// Parse command-line arguments
		flag.StringVar(&confPath, "config", "", "path of application config file")
		flag.Parse()

		// If `--config` is not specified, check if user has an extra argument like `go run main.go dev`, which we consider it as `--config "./userland/config/dev.json"`.
		userArgs := os.Args[1:]
		if len(userArgs) >= 1 {
			confPath = configFile(userArgs[0] + ".json")
		} else {
			flag.PrintDefaults()
			os.Exit(1)
		}
	}

	// Read config file
	conf = config.MustReadConfig(confPath, userlandDir())

	log.Printf("✅ App config: Loaded at \"%v\"", confPath)
	if conf.TestMode != nil {
		log.Printf("🟣 Application running in test mode: %v", conf.TestMode)
	} else if conf.DevMode() {
		log.Printf("🟡 Application running in dev mode")
	}
}

func userlandDir() string {
	return "../userland"
}

func configFile(name string) string {
	return filepath.Join(userlandDir(), "config", name)
}
