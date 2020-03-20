package cfg

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"qing/app/cfg/config"
	"runtime"
	"strings"

	"github.com/imdario/mergo"
	"github.com/mgenware/go-packagex/v5/iox"
	"gopkg.in/go-playground/validator.v9"
)

// Config is the root configuration type for your application.
type Config struct {
	// Extends specifies another file which this file extends from.
	Extends string `json:"extends"`
	// Debug determines if this app is currently running in dev mode. You can set or unset individual child config field. Note that `"debug": {}` will set debug mode to on and make all child fields defaults to `false/empty`, to disable debug mode, you either leave it unspecified or set it to `null`.
	Debug *config.DebugConfig `json:"debug"`
	// Log config data.
	Log *config.LogConfig `json:"log" validate:"required"`
	// HTTP config data.
	HTTP *config.HTTPConfig `json:"http" validate:"required"`
	// Templates config data.
	Templates *config.TemplatesConfig `json:"templates" validate:"required"`
	// Localization config data.
	Localization *config.LocalizationConfig `json:"localization" validate:"required"`

	AppProfile *config.AppProfileConfig `json:"app_profile" validate:"required"`

	DBConnString string                  `json:"db_conn_string" validate:"required"`
	ResServer    *config.ResServerConfig `json:"res_server" validate:"required"`
	// Extern config data.
	Extern *config.ExternConfig `json:"extern" validate:"required"`
}

// DevMode checks if debug config field is on.
func (config *Config) DevMode() bool {
	return config.Debug != nil
}

func readConfigCore(file string) (*Config, error) {
	log.Printf("🚙 Loading config at \"%v\"", file)
	var config Config

	bytes, err := ioutil.ReadFile(file)
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
			abs, err := filepath.Abs(file)
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
	ext := filepath.Ext(file)
	osConfFile := strings.TrimSuffix(file, ext) + "_" + osName + ext
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

// ReadConfig constructs a config object from the given file.
func ReadConfig(file string) (*Config, error) {
	config, err := readConfigCore(file)
	if err != nil {
		return nil, err
	}
	err = config.validateAndCoerce()
	if err != nil {
		return nil, err
	}
	return config, nil
}

func (config *Config) validateAndCoerce() error {
	// Validate
	validate := validator.New()
	err := validate.Struct(config)
	if err != nil {
		panic(fmt.Errorf("Config validation failed, %v", err.Error()))
	}

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
	return nil
}

func mustCoercePath(p *string) {
	if p == nil {
		return
	}
	if filepath.IsAbs(*p) {
		return
	}
	res, err := filepath.Abs(*p)
	if err != nil {
		panic(err)
	}
	*p = res
}
