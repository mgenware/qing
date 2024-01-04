/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appcfg

type EmailConfig struct {
	Email       string           `json:"email,omitempty"`
	UserName    string           `json:"user_name,omitempty"`
	Pwd         string           `json:"pwd,omitempty"`
	DisplayName string           `json:"display_name,omitempty"`
	SMTP        *EmailSMTPConfig `json:"smtp,omitempty"`
}

type EmailSMTPConfig struct {
	Host string `json:"host,omitempty"`
	Port int    `json:"port,omitempty"`
	SSL  bool   `json:"ssl,omitempty"`
}
