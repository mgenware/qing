package config

import (
	"encoding/json"
	"errors"
	"path/filepath"

	"qing/app/config/internals"
)

// Config is the root configuration type for your application.
type Config struct {
	// DevMode determines if this app is currently running in dev mode.
	DevMode bool `json:"devMode"`

	// HTTP holds HTTP-related configuration data.
	HTTP *internals.HTTPConfig `json:"http"`

	Templates    internals.TemplatesConfig    `json:"templates"`
	Localization internals.LocalizationConfig `json:"localization"`
	Assets       internals.AssetsConfig       `json:"assets"`
	DBConnString string                       `json:"db_conn_string"`
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
	// HTTP
	httpConfig := config.HTTP
	if httpConfig == nil {
		return errors.New("Missing http config")
	}

	if httpConfig.Port == 0 {
		return errors.New("http.port must not be 0")
	}

	httpStaticConfig := httpConfig.Static
	if httpStaticConfig != nil {
		if httpStaticConfig.Pattern == "" {
			return errors.New("http.static has been defined, but http.static.pattern remains empty")
		}
		if httpStaticConfig.Dir == "" {
			return errors.New("http.static has been defined, but http.static.dir remains empty")
		}
	}

	if httpStaticConfig != nil {
		mustCoercePath(&httpStaticConfig.Dir)
	}

	// Templates
	templatesConfig := config.Templates
	mustCoercePath(&templatesConfig.RootDir)

	// Localization
	localizationConfig := config.Localization
	mustCoercePath(&localizationConfig.RootDir)
	if localizationConfig.DefaultLang == "" {
		return errors.New("localization.defaultLang is required")
	}

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
