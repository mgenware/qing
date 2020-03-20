package config

// AppProfileConfig ...
type AppProfileConfig struct {
	Dir string `json:"dir" validate:"required"`
}
