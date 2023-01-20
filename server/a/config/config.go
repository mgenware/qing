/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package config

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"qing/a/config/configs"
	"qing/a/def/infdef"
	"qing/lib/iolib"
	"runtime"

	"github.com/imdario/mergo"
	"github.com/xeipuuv/gojsonschema"
)

// Config is the root configuration type for your application.
type Config struct {
	// Specifies another file which this file extends from.
	Extends string `json:"extends,omitempty"`
	// Determines if this app is currently running in dev mode.
	// Set it to null in production mode.
	Dev *configs.DevConfig `json:"dev,omitempty"`
	// Log config data.
	Log *configs.LoggingConfig `json:"logging,omitempty"`
	// HTTP config data.
	HTTP *configs.HTTPConfig `json:"http,omitempty"`
	// Templates config data.
	Templates *configs.TemplatesConfig `json:"templates,omitempty"`

	AppProfile  *configs.AppProfileConfig  `json:"app_profile,omitempty"`
	AppSettings *configs.AppSettingsConfig `json:"app_settings,omitempty"`

	DB        *configs.DBConfig        `json:"db,omitempty"`
	ResServer *configs.ResServerConfig `json:"res_server,omitempty"`

	// External configs.
	Extern *configs.ExternConfig `json:"extern,omitempty"`
}

// Returns true if unit test mode is on.
func IsUT() bool {
	return os.Getenv(infdef.UtEnv) == "1"
}

// Returns true if dev mode is on.
func (conf *Config) DevMode() bool {
	return conf.Dev != nil
}

// Returns true if production mode is on.
func (conf *Config) ProductionMode() bool {
	return !conf.DevMode()
}

func IsFirstRun() bool {
	return os.Getenv("QING_FR") == "1"
}

func readConfigCore(absFile string) (*Config, error) {
	log.Printf("Loading config at \"%v\"", absFile)
	var conf Config

	err := iolib.ReadJSONFile(absFile, &conf)
	if err != nil {
		return nil, err
	}

	if conf.Extends != "" {
		extends := conf.Extends
		if filepath.IsAbs(extends) {
			return nil, fmt.Errorf("`extends` cannot be an absolute path, got %v", extends)
		}
		extendsFile := filepath.Join(filepath.Dir(absFile), extends)
		basedOn, err := readConfigCore(extendsFile)
		if err != nil {
			return nil, err
		}
		if err := mergo.Merge(&conf, basedOn); err != nil {
			return nil, err
		}
	}
	return &conf, nil
}

// MustReadConfig constructs a config object from the given file.
func MustReadConfig(absFile string) *Config {
	if !filepath.IsAbs(absFile) {
		panic(fmt.Errorf("expected an absolute filepath, got %v", absFile))
	}
	conf, err := readConfigCore(absFile)
	if err != nil {
		panic(err)
	}

	mustValidateConfig(conf)

	// Once the config is loaded, set `extends` to empty.
	conf.Extends = ""

	return conf
}

func mustValidateConfig(conf *Config) {
	// Validate with JSON schema.
	log.Printf("Validating config against schema \"%v\"", infdef.ConfigSchemaFile)

	schemaFilePath := toFileURI(infdef.ConfigSchemaFile)
	schemaLoader := gojsonschema.NewReferenceLoader(schemaFilePath)
	documentLoader := gojsonschema.NewGoLoader(conf)

	result, err := gojsonschema.Validate(schemaLoader, documentLoader)
	if err != nil {
		panic(err)
	}

	if !result.Valid() {
		fmt.Printf("Config file validation error:\n")
		for _, desc := range result.Errors() {
			fmt.Printf("- %s\n", desc)
		}
		panic(fmt.Errorf("config file validation failed"))
	}

	if IsUT() {
		// Test flag is forbidden in production.
		if conf.ProductionMode() {
			panic(fmt.Errorf("you cannot have test mode set in production mode"))
		}
	}
}

func toFileURI(path string) string {
	prefix := "file://"
	if runtime.GOOS == "windows" {
		prefix += "/"
	}
	return prefix + path
}
