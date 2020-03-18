package config

type TemplatesConfig struct {
	Dir string `json:"dir" validate:"required"`
}
