package internals

// ExternConfig ...
type ExternConfig struct {
	// Redis ...
	Redis *ExternRedisConfig `json:"redis" validate:"required"`
	// Node libs...
	NodeLibs *ExternNodeLibConfig `json:"node_libs" validate:"required"`
	// ConvertCmd ...
	ConvertCmd string `json:"convert_cmd" validate:"required"`
}

// ExternRedisConfig ...
type ExternRedisConfig struct {
	// Port is the port redis will be connect to.
	Port int `json:"port" validate:"gt=0"`
}

// ExternNodeLibConfig ...
type ExternNodeLibConfig struct {
	// Dir is the root directory of node libs.
	Dir string `json:"dir" validate:"required"`
}
