/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package config

import (
	"errors"
	"fmt"
	"log"
	"path/filepath"
	"qing/app/config/configs"
	"qing/lib/iolib"
	"runtime"
	"strings"

	"github.com/imdario/mergo"
	"github.com/mgenware/goutil/iox"
	"github.com/xeipuuv/gojsonschema"
)

const schemaFileName = "qing-conf.schema.json"

const (
	testNone = iota
	testUnit = iota
	testAPI  = iota
	testBR   = iota
)

// Config is the root configuration type for your application.
type Config struct {
	// Extends specifies another file which this file extends from.
	Extends string `json:"extends"`
	// Debug determines if this app is currently running in dev mode. You can set or unset individual child config field. Note that `"debug": {}` will set debug mode to on and make all child fields defaults to `false/empty`, to disable debug mode, you either leave it unspecified or set it to `null`.
	Debug *configs.DebugConfig `json:"debug"`
	// Log config data.
	Log *configs.LoggingConfig `json:"logging"`
	// HTTP config data.
	HTTP *configs.HTTPConfig `json:"http"`
	// Templates config data.
	Templates *configs.TemplatesConfig `json:"templates"`
	// Localization config data.
	Localization *configs.LocalizationConfig `json:"localization"`

	AppProfile  *configs.AppProfileConfig  `json:"app_profile"`
	AppSettings *configs.AppSettingsConfig `json:"app_settings"`

	DB        *configs.DBConfig        `json:"db"`
	ResServer *configs.ResServerConfig `json:"res_server"`

	// Extern config data.
	Extern *configs.ExternConfig `json:"extern"`
	// Possible values:
	// `u`: unit tests, `api`: API tests, `br`: browser tests.
	TestMode *string `json:"test_mode"`
	// Integer representation of `TestMode` used for faster comparison.
	testModeNum int
}

// DevMode checks if debug config field is on.
func (conf *Config) DevMode() bool {
	return conf.Debug != nil
}

// ProductionMode = !DevMode().
func (conf *Config) ProductionMode() bool {
	return !conf.DevMode()
}

func (conf *Config) UnitTest() bool {
	return conf.testModeNum == testUnit
}

func (conf *Config) APITest() bool {
	return conf.testModeNum == testAPI
}

func (conf *Config) BRTest() bool {
	return conf.testModeNum == testBR
}

func readConfigCore(absFile string) (*Config, error) {
	log.Printf("🚙 Loading config at \"%v\"", absFile)
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
func MustReadConfig(file string, workingDir string) *Config {
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

	schemaPath := filepath.Join(filepath.Dir(absFile), schemaFileName)
	mustValidateConfig(conf, schemaPath)
	conf.mustCoerceConfig(workingDir)
	return conf
}

func mustValidateConfig(conf *Config, schemaFilePath string) {
	// Validate with JSON schema.
	log.Printf("Validate config against schema \"%v\"", schemaFilePath)

	schemaFilePath = toFileURI(schemaFilePath)
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
		panic(errors.New("Config file validation failed"))
	}
}

func (conf *Config) mustCoerceConfig(dir string) {
	if conf.TestMode != nil {
		// Test flag is forbidden in production.
		if conf.ProductionMode() {
			panic("You cannot have test mode set in production mode")
		}
		modeString := *conf.TestMode
		switch modeString {
		case "u":
			conf.testModeNum = testUnit
		case "api":
			conf.testModeNum = testAPI
		case "br":
			conf.testModeNum = testBR
		default:
			panic(fmt.Errorf("Unknown test mode value \"%v\"", modeString))
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
