package internals

type ExternConfig struct {
	// Redis ...
	Redis *ExternRedisConfig `json:"redis" validate:"required"`
	// Node libs...
	NodeLibs *ExternNodeLibConfig `json:"node_libs" validate:"required"`
}

type ExternRedisConfig struct {
	// Port is the port redis will be connect to.
	Port int `json:"port" validate:"gt=0"`
}

type ExternNodeLibConfig struct {
	// Dir is the root directory of node libs.
	Dir string `json:"dir" validate:"required"`
}
