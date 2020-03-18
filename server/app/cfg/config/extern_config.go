package config

// ExternConfig ...
type ExternConfig struct {
	// Redis ...
	Redis *ExternRedisConfig `json:"redis" validate:"required"`
	// ImgxCmd ...
	ImgxCmd string `json:"imgx_cmd" validate:"required"`
}

// ExternRedisConfig ...
type ExternRedisConfig struct {
	// Port is the port redis will be connect to.
	Port int `json:"port" validate:"gt=0"`
}
