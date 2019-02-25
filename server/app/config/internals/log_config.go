package internals

type LogConfig struct {
	Dir string `json:"dir" validate:"required"`
}
