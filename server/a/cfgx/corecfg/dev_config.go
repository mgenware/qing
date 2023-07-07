/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package corecfg

type TurboWebConfig struct {
	Dir string `json:"dir,omitempty"`
	URL string `json:"url,omitempty"`
}

type MailBoxConfig struct {
	Dir string `json:"dir,omitempty"`
}

type DevConfig struct {
	ReloadViewsOnRefresh        bool            `json:"reload_views_on_refresh,omitempty"`
	PanicOnUnexpectedHTMLErrors bool            `json:"panic_on_unexpected_html_errors,omitempty"`
	PanicOnUnexpectedJSONErrors bool            `json:"panic_on_unexpected_json_errors,omitempty"`
	TurboWeb                    *TurboWebConfig `json:"turbo_web,omitempty"`
	MailBox                     *MailBoxConfig  `json:"mailbox,omitempty"`
	RealMail                    bool            `json:"real_mail,omitempty"`
}
