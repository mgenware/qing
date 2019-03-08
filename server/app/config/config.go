package config

import (
	"encoding/json"
	"fmt"
	"path/filepath"

	"qing/app/config/internals"

	"gopkg.in/go-playground/validator.v9"
)

// Config is the root configuration type for your application.
type Config struct {
	// Debug determines if this app is currently running in dev mode. You can set or unset individual child config field. Note that `"debug": {}` will set debug mode to on and make all child fields defaults to `false/empty`, to disable debug mode, you either leave it unspecified or set it to `null`.
	Debug *internals.DebugConfig `json:"debug"`
	// Log config data.
	Log *internals.LogConfig `json:"log" validate:"required"`
	// HTTP config data.
	HTTP *internals.HTTPConfig `json:"http" validate:"required"`
	// Templates config data.
	Templates *internals.TemplatesConfig `json:"templates" validate:"required"`
	// Localization config data.
	Localization *internals.LocalizationConfig `json:"localization" validate:"required"`

	// --- Extended fields outside go-triton ---
	DBConnString string                     `json:"db_conn_string" validate:"required"`
	ResServer    *internals.ResServerConfig `json:"res_server" validate:"required"`
	// Extern config data.
	Extern *internals.ExternConfig `json:"extern" validate:"required"`
}

// DevMode checks if debug config field is on.
func (config *Config) DevMode() bool {
	return config.Debug != nil
}

// ReadConfig loads an ConfigType from an array of bytes.
func ReadConfig(bytes []byte) (*Config, error) {
	var config Config

	err := json.Unmarshal(bytes, &config)
	if err != nil {
		return nil, err
	}

	err = config.validateAndCoerce()
	if err != nil {
		return nil, err
	}
	return &config, nil
}

func (config *Config) validateAndCoerce() error {
	// Validate
	validate := validator.New()
	err := validate.Struct(config)
	if err != nil {
		panic(fmt.Errorf("Config validation failed, %v", err.Error()))
	}

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
