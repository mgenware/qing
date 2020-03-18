package config

type HTTPConfig struct {
	// Port is the listening port of web server.
	Port int `json:"port" validate:"gt=0"`
	// Static defines how server serves static files (optional).
	Static *HTTPStaticConfig `json:"static" validate:"required"`
	// Log404Error controls if 404 errors are logged.
	Log404Error bool `json:"log_404_error" validate:"required"`
}

type HTTPStaticConfig struct {
	// URL is the URL pattern used for registering request handler.
	URL string `json:"url" validate:"required"`
	// Dir is the physical directory path you want to be served.
	Dir string `json:"dir" validate:"required"`
}
