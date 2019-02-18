package internals

type HTTPConfig struct {
	// Port is the listening port of web server.
	Port int `json:"port"`
	// Static defines how server serves static files (optional).
	Static *HTTPStaticConfig `json:"static"`
}

type HTTPStaticConfig struct {
	// Pattern is the pattern string used for registering request handler.
	Pattern string `json:"pattern"`
	// Dir is the physical directory path you want to be served.
	Dir string `json:"dir"`
}
