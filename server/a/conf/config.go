/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package conf

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"qing/a/conf/confs"
	"qing/a/def/infraDef"
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
	Dev *confs.DevConfig `json:"dev,omitempty"`
	// Log config data.
	Log *confs.LoggingConfig `json:"logging,omitempty"`
	// HTTP config data.
	HTTP *confs.HTTPConfig `json:"http,omitempty"`
	// Templates config data.
	Templates *confs.TemplatesConfig `json:"templates,omitempty"`
	Site      *confs.SiteConfig      `json:"site,omitempty"`

	AppProfile  *confs.AppProfileConfig  `json:"app_profile,omitempty"`
	AppSettings *confs.AppSettingsConfig `json:"app_settings,omitempty"`

	DB          *confs.DBConfig          `json:"db,omitempty"`
	ResServer   *confs.ResServerConfig   `json:"res_server,omitempty"`
	Permissions *confs.PermissionsConfig `json:"permissions,omitempty"`
	Content     *confs.ContentConfig     `json:"content,omitempty"`
	Mail        *confs.MailConfig        `json:"mail,omitempty"`
	Extern      *confs.ExternConfig      `json:"extern,omitempty"`
	Forums      *confs.ForumsConfig      `json:"forums,omitempty"`
	ZTest       *confs.ZTestConfig       `json:"z_test,omitempty"`
}

// Returns true if unit test mode is on.
func IsUTEnv() bool {
	return os.Getenv(infraDef.UtEnv) == "1"
}

// Returns true if BR mode is on.
func IsBREnv() bool {
	return os.Getenv(infraDef.BrEnv) == "1"
}

// Returns true if dev mode is on.
func (c *Config) DevMode() bool {
	return c.Dev != nil
}

// Returns true if production mode is on.
func (c *Config) ProductionMode() bool {
	return !c.DevMode()
}

// Checks if forums mode is enabled.
func (c *Config) FourmsEnabled() bool {
	return c.Forums != nil && c.Forums.Enabled
}

func IsFirstRun() bool {
	return os.Getenv("QING_FR") == "1"
}

func readConfigCore(absFile string) (*Config, error) {
	log.Printf("Loading config at \"%v\"", absFile)
	var current Config

	err := iolib.ReadJSONFile(absFile, &current)
	if err != nil {
		return nil, err
	}

	if current.Extends != "" {
		extends := current.Extends
		if filepath.IsAbs(extends) {
			return nil, fmt.Errorf("`extends` cannot be an absolute path, got %v", extends)
		}
		extendsFile := filepath.Join(filepath.Dir(absFile), extends)
		parent, err := readConfigCore(extendsFile)
		if err != nil {
			return nil, err
		}
		if err := mergo.Merge(&current, parent); err != nil {
			return nil, err
		}
	}
	// Ret `extends` to empty.
	current.Extends = ""

	return &current, nil
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

	return conf
}

func CloneConfig(c *Config) (*Config, error) {
	bytes, err := json.Marshal(c)
	if err != nil {
		return nil, err
	}
	var res Config
	err = json.Unmarshal(bytes, &res)
	if err != nil {
		return nil, err
	}
	return &res, nil
}

func mustValidateConfig(c *Config) {
	// Validate with JSON schema.
	log.Printf("Validating config against schema \"%v\"", infraDef.ConfigSchemaFile)

	schemaFilePath := toFileURI(infraDef.ConfigSchemaFile)
	schemaLoader := gojsonschema.NewReferenceLoader(schemaFilePath)
	documentLoader := gojsonschema.NewGoLoader(c)

	result, err := gojsonschema.Validate(schemaLoader, documentLoader)
	if err != nil {
		panic(err)
	}

	if !result.Valid() {
		fmt.Print("Config file validation error:\n")
		fmt.Print("======= Start of validation errors =======\n")
		for _, desc := range result.Errors() {
			fmt.Printf("- %s\n", desc)
		}
		fmt.Print("======= End of validation errors =======\n")

		fmt.Print("======= Start of config content =======\n")

		configJSON, err := json.MarshalIndent(c, "", "  ")
		if err != nil {
			configJSON = []byte(fmt.Sprintf("Failed to marshal config to JSON: %v", err))
		}
		fmt.Printf("%v\n", string(configJSON))
		fmt.Print("======= End of config content =======\n")
		panic(fmt.Errorf("config file validation failed"))
	}

	if IsUTEnv() {
		// Test flag is forbidden in production.
		if c.ProductionMode() {
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
