/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package corecfg

type HTTPConfig struct {
	// Port is the listening port of web server.
	Port int `json:"port,omitempty"`
	// Static defines how server serves static files (optional).
	Static *HTTPStaticConfig `json:"static,omitempty"`
	// Log404Error controls if 404 errors are logged.
	Log404Error bool `json:"log_404_error,omitempty"`
}

type HTTPStaticConfig struct {
	// URL is the URL pattern used for registering request handler.
	URL string `json:"url,omitempty"`
	// Dir is the physical directory path you want to be served.
	Dir string `json:"dir,omitempty"`
}
