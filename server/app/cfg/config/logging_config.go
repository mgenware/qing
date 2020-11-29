package config

// LoggingConfig ...
type LoggingConfig struct {
	Dir string `json:"dir" validate:"required"`
}
