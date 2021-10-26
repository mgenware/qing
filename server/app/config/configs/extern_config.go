/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package configs

// ExternConfig ...
type ExternConfig struct {
	// Redis ...
	Redis *ExternRedisConfig `json:"redis"`
	// ImageProxy ...
	ImageProxy *ImgProxyConfig `json:"img_proxy"`
}

// ExternRedisConfig ...
type ExternRedisConfig struct {
	// Port is the port redis will be connect to.
	Port int `json:"port"`
}

// ImgProxyConfig ...
type ImgProxyConfig struct {
	Port int `json:"port"`
}
