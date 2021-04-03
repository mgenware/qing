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
	"qing/app/config"
)

var conf *config.Config

func Get() *config.Config {
	return conf
}

func init() {
	// Parse command-line arguments
	var configPath string
	flag.StringVar(&configPath, "config", "", "path of application config file")
	flag.Parse()

	if configPath == "" {
		// If --config is not specified, check if user has an extra argument like "go run main.go dev", which we consider it as --config "./config/dev.json"
		userArgs := os.Args[1:]
		if len(userArgs) >= 1 {
			configPath = config.GetDefaultConfigFilePath(userArgs[0] + ".json")
		} else {
			flag.PrintDefaults()
			os.Exit(1)
		}
	}

	// Read config file
	conf = config.MustReadConfig(configPath)

	log.Printf("✅ App config: Loaded at \"%v\"", configPath)
	if conf.DevMode() {
		log.Printf("😡 Application running in dev mode")
	}
}
