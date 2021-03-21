/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package config

// ResServerConfig ...
type ResServerConfig struct {
	// URL is the URL pattern used for registering request handler.
	URL string `json:"url"`
	// Dir is the path of app resource directory.
	Dir string `json:"dir"`
}
