/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package confs

type MailConfig struct {
	Auth MailAuthConfig `json:"auth,omitempty"`
}

type MailAuthConfig struct {
	Identity string `json:"identity,omitempty"`
	UserName string `json:"user_name,omitempty"`
	Pwd      string `json:"pwd,omitempty"`
	Host     string `json:"host,omitempty"`
	Port     int    `json:"port,omitempty"`
}
