/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package confs

type ExternConfig struct {
	Redis      *ExternRedisConfig `json:"redis,omitempty"`
	ImageProxy *ImgProxyConfig    `json:"img_proxy,omitempty"`
}

type ExternRedisConfig struct {
	// Port is the port redis will be connect to.
	Port    int  `json:"port,omitempty"`
	Logging bool `json:"logging,omitempty"`
}

type ImgProxyConfig struct {
	Port int `json:"port,omitempty"`
}
