package internals

type ExternConfig struct {
	// Redis ...
	Redis *ExternRedisConfig `json:"redis" validate:"required"`
}

type ExternRedisConfig struct {
	// Port is the port redis will be connect to.
	Port int `json:"port" validate:"gt=0"`
}
