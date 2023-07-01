/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package corecfg

type HTTPConfig struct {
	// Listening port of web server.
	Port int `json:"port,omitempty"`
	// Defines how server serves static files (optional).
	Static *HTTPStaticConfig `json:"static,omitempty"`
	// If 404 errors are logged.
	Log404Error bool `json:"log_404_error,omitempty"`
	// HTTP only mode.
	UnsafeMode bool `json:"unsafe_mode,omitempty"`
}

type HTTPStaticConfig struct {
	// The URL pattern used for registering request handler.
	URL string `json:"url,omitempty"`
	// Dir is the physical directory path you want to be served.
	Dir string `json:"dir,omitempty"`
}
