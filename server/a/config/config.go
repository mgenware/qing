/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package config

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"qing/a/config/configs"
	"qing/a/def/infdef"
	"qing/lib/iolib"
	"runtime"
	"strings"

	"github.com/imdario/mergo"
	"github.com/mgenware/goutil/iox"
	"github.com/xeipuuv/gojsonschema"
)

// Config is the root configuration type for your application.
type Config struct {
	// Specifies another file which this file extends from.
	Extends string `json:"extends,omitempty"`
	// Defines core properties of this website.
	Site *configs.SiteConfig `json:"site,omitempty"`
	// Determines if this app is currently running in dev mode.
	// Set it to null in production mode.
	Dev *configs.DevConfig `json:"dev,omitempty"`
	// Log config data.
	Log *configs.LoggingConfig `json:"logging,omitempty"`
	// HTTP config data.
	HTTP *configs.HTTPConfig `json:"http,omitempty"`
	// Templates config data.
	Templates *configs.TemplatesConfig `json:"templates,omitempty"`
	// Localization config data.
	Localization *configs.LocalizationConfig `json:"localization,omitempty"`

	AppProfile  *configs.AppProfileConfig  `json:"app_profile,omitempty"`
	AppSettings *configs.AppSettingsConfig `json:"app_settings,omitempty"`

	DB        *configs.DBConfig        `json:"db,omitempty"`
	ResServer *configs.ResServerConfig `json:"res_server,omitempty"`

	// External configs.
	Extern *configs.ExternConfig `json:"extern,omitempty"`
}

// Returns true if unit test mode is on.
func IsUT() bool {
	return os.Getenv("UT") == "1"
}

// Returns true if dev mode is on.
func (conf *Config) DevMode() bool {
	return conf.Dev != nil
}

// Returns true if production mode is on.
func (conf *Config) ProductionMode() bool {
	return !conf.DevMode()
}

func readConfigCore(absFile string) (*Config, error) {
	log.Printf("Loading config at \"%v\"", absFile)
	var conf Config

	err := iolib.ReadJSONFile(absFile, &conf)
	if err != nil {
		return nil, err
	}

	if conf.Extends != "" {
		extendsFile := conf.Extends
		if !filepath.IsAbs(extendsFile) {
			abs, err := filepath.Abs(absFile)
			if err != nil {
				return nil, err
			}
			baseDir := filepath.Dir(abs)
			extendsFile = filepath.Join(baseDir, extendsFile)
		}
		basedOn, err := readConfigCore(extendsFile)
		if err != nil {
			return nil, err
		}
		if err := mergo.Merge(&conf, basedOn); err != nil {
			return nil, err
		}
	}

	// Load platform specific config file
	osName := runtime.GOOS
	if osName == "darwin" {
		osName = "macos"
	}
	// /a/b.json -> /a/b_linux.json
	ext := filepath.Ext(absFile)
	osConfFile := strings.TrimSuffix(absFile, ext) + "_" + osName + ext
	if iox.IsFile(osConfFile) {
		osConfig, err := readConfigCore(osConfFile)
		if err != nil {
			return nil, err
		}
		if err := mergo.Merge(&conf, osConfig); err != nil {
			return nil, err
		}
	}
	return &conf, nil
}

// MustReadConfig constructs a config object from the given file.
func MustReadConfig(file string) *Config {
	absFile := file
	if !filepath.IsAbs(file) {
		s, err := filepath.Abs(file)
		if err != nil {
			panic(err)
		}
		absFile = s
	}
	conf, err := readConfigCore(absFile)
	if err != nil {
		panic(err)
	}

	mustValidateConfig(conf)
	conf.mustCoerceConfig(filepath.Dir(file))

	// Once the config is loaded, set `extends` to empty.
	conf.Extends = ""

	return conf
}

func SerializeConfig(conf *Config) ([]byte, error) {
	return json.Marshal(conf)
}

func DeepCopyConfig(conf *Config) (*Config, error) {
	bytes, err := SerializeConfig(conf)
	if err != nil {
		return nil, err
	}

	var newConf Config
	err = json.Unmarshal(bytes, &newConf)
	if err != nil {
		return nil, err
	}
	return &newConf, nil
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
}

func (conf *Config) mustCoerceConfig(dir string) {
	if IsUT() {
		// Test flag is forbidden in production.
		if conf.ProductionMode() {
			panic(fmt.Errorf("you cannot have test mode set in production mode"))
		}
	}

	// AppProfile
	appProfileConfig := conf.AppProfile
	mustCoercePathPtr(dir, &appProfileConfig.Dir)

	// HTTP
	httpConfig := conf.HTTP
	httpStaticConfig := httpConfig.Static
	if httpStaticConfig != nil {
		mustCoercePathPtr(dir, &httpStaticConfig.Dir)
	}

	// Templates
	templatesConfig := conf.Templates
	mustCoercePathPtr(dir, &templatesConfig.Dir)

	// Localization
	localizationConfig := conf.Localization
	mustCoercePathPtr(dir, &localizationConfig.Dir)

	// Res
	resConfig := conf.ResServer
	mustCoercePathPtr(dir, &resConfig.Dir)
}

func mustCoercePath(dir, p string) string {
	if p == "" {
		return p
	}
	if filepath.IsAbs(p) {
		return p
	}
	return filepath.Join(dir, p)
}

func mustCoercePathPtr(dir string, p *string) {
	if p == nil {
		return
	}
	absPath := mustCoercePath(dir, *p)
	*p = absPath
}

func toFileURI(path string) string {
	prefix := "file://"
	if runtime.GOOS == "windows" {
		prefix += "/"
	}
	return prefix + path
}
