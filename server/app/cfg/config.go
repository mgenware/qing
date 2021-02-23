package cfg

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"qing/app/cfg/config"
	"runtime"
	"strings"

	"github.com/imdario/mergo"
	"github.com/mgenware/go-packagex/v5/iox"
	"github.com/xeipuuv/gojsonschema"
)

const configDir = "./config/"
const schemaFileName = "config.schema.json"

// GetDefaultConfigFilePath returns a config file path in default app config dir.
func GetDefaultConfigFilePath(name string) string {
	return filepath.Join(configDir, name)
}

// Config is the root configuration type for your application.
type Config struct {
	// Extends specifies another file which this file extends from.
	Extends string `json:"extends"`
	// Setup contains first launch user setup configs.
	Setup *config.SetupConfig `json:"setup"`
	// Debug determines if this app is currently running in dev mode. You can set or unset individual child config field. Note that `"debug": {}` will set debug mode to on and make all child fields defaults to `false/empty`, to disable debug mode, you either leave it unspecified or set it to `null`.
	Debug *config.DebugConfig `json:"debug"`
	// Log config data.
	Log *config.LoggingConfig `json:"logging"`
	// HTTP config data.
	HTTP *config.HTTPConfig `json:"http"`
	// Templates config data.
	Templates *config.TemplatesConfig `json:"templates"`
	// Localization config data.
	Localization *config.LocalizationConfig `json:"localization"`

	AppProfile *config.AppProfileConfig `json:"app_profile"`

	DB        *config.DBConfig        `json:"db"`
	ResServer *config.ResServerConfig `json:"res_server"`
	// Extern config data.
	Extern *config.ExternConfig `json:"extern"`
}

// DevMode checks if debug config field is on.
func (config *Config) DevMode() bool {
	return config.Debug != nil
}

func readConfigCore(absFile string) (*Config, error) {
	log.Printf("🚙 Loading config at \"%v\"", absFile)
	var config Config

	bytes, err := os.ReadFile(absFile)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(bytes, &config)
	if err != nil {
		return nil, err
	}

	if config.Extends != "" {
		extendsFile := config.Extends
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
		if err := mergo.Merge(&config, basedOn); err != nil {
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
		if err := mergo.Merge(&config, osConfig); err != nil {
			return nil, err
		}
	}
	return &config, nil
}

// MustReadConfig constructs a config object from the given file.
func MustReadConfig(file string) *Config {
	absFile := mustGetAbsPath(file)
	config, err := readConfigCore(absFile)
	if err != nil {
		panic(err)
	}

	mustValidateConfig(config)
	config.mustCoerceConfig()
	return config
}

func mustValidateConfig(config *Config) {
	// Validate with JSON schema.
	schemaFilePath := toFileURI(mustGetAbsPath(filepath.Join(configDir, schemaFileName)))
	log.Printf("🚙 Validate config against schema \"%v\"", schemaFilePath)

	schemaLoader := gojsonschema.NewReferenceLoader(schemaFilePath)
	documentLoader := gojsonschema.NewGoLoader(config)

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

func (config *Config) mustCoerceConfig() {
	// AppProfile
	appProfileConfig := config.AppProfile
	mustCoercePath(&appProfileConfig.Dir)

	// HTTP
	httpConfig := config.HTTP
	httpStaticConfig := httpConfig.Static
	if httpStaticConfig != nil {
		mustCoercePath(&httpStaticConfig.Dir)
	}

	// Templates
	templatesConfig := config.Templates
	mustCoercePath(&templatesConfig.Dir)

	// Localization
	localizationConfig := config.Localization
	mustCoercePath(&localizationConfig.Dir)

	// Res
	resConfig := config.ResServer
	mustCoercePath(&resConfig.Dir)
}

func mustGetAbsPath(p string) string {
	if p == "" {
		return p
	}
	if filepath.IsAbs(p) {
		return p
	}
	res, err := filepath.Abs(p)
	if err != nil {
		panic(err)
	}
	return res
}

func mustCoercePath(p *string) {
	if p == nil {
		return
	}
	absPath := mustGetAbsPath(*p)
	*p = absPath
}

func toFileURI(path string) string {
	prefix := "file://"
	if runtime.GOOS == "windows" {
		prefix += "/"
	}
	return prefix + path
}
