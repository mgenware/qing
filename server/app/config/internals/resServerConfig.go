package internals

type ResServerConfig struct {
	// URL is the URL pattern used for registering request handler.
	URL string `json:"url" validate:"required"`
	// Dir is the physical directory path you want to be served.
	Dir string `json:"dir" validate:"required"`
}
