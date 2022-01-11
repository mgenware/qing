/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package configs

// DBConfig ...
type DBConfig struct {
	User     string `json:"user"`
	Pwd      string `json:"pwd"`
	Database string `json:"database"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Params   string `json:"params"`
}
