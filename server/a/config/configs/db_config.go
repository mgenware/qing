/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package configs

// DBConfig ...
type DBConfig struct {
	User     string `json:"user,omitempty"`
	Pwd      string `json:"pwd,omitempty"`
	Database string `json:"database,omitempty"`
	Host     string `json:"host,omitempty"`
	Port     int    `json:"port,omitempty"`
	Params   string `json:"params,omitempty"`
}
