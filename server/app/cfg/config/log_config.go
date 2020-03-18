package config

// LogConfig ...
type LogConfig struct {
	Dir string `json:"dir" validate:"required"`
}
