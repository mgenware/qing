package config

// ResServerConfig ...
type ResServerConfig struct {
	// URL is the URL pattern used for registering request handler.
	URL string `json:"url" validate:"required"`
	// Dir is the path of app resource directory.
	Dir string `json:"dir" validate:"required"`
}
