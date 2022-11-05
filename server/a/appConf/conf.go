/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConf

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"qing/a/config"
)

var conf *config.Config
var confPath string

const userlandDirName = "userland"

func Get() *config.Config {
	return conf
}

func init() {
	if config.IsUT() {
		// Unit test mode.
		confPath = configFile("dev.json")
	} else {
		// Parse command-line arguments
		flag.StringVar(&confPath, "config", "", "path of application config file")
		flag.Parse()

		// If `--config` is not specified, check cases like `go run main.go dev`.
		userArgs := os.Args[1:]
		if len(userArgs) >= 1 {
			confPath = configFile(userArgs[0] + ".json")
		} else {
			fmt.Print("Fatal error: no config file specified.")
			flag.PrintDefaults()
			os.Exit(1)
		}
	}

	// Read config file
	conf = config.MustReadConfig(confPath, userlandDir())
}

func userlandDir() string {
	return "/qing/" + userlandDirName
}

func configFile(name string) string {
	return filepath.Join(userlandDir(), "config", name)
}
