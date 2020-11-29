package config

// ExternConfig ...
type ExternConfig struct {
	// Redis ...
	Redis *ExternRedisConfig `json:"redis"`
	// ImgxCmd ...
	ImgxCmd string `json:"imgx_cmd"`
}

// ExternRedisConfig ...
type ExternRedisConfig struct {
	// Port is the port redis will be connect to.
	Port int `json:"port"`
}
