/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package configs

type TurboWebConfig struct {
	Dir string `json:"dir"`
	URL string `json:"url"`
}

// DebugConfig ...
type DebugConfig struct {
	ReloadViewsOnRefresh        bool            `json:"reload_views_on_refresh"`
	PanicOnUnexpectedHTMLErrors bool            `json:"panic_on_unexpected_html_errors"`
	PanicOnUnexpectedJSONErrors bool            `json:"panic_on_unexpected_json_errors"`
	TurboWeb                    *TurboWebConfig `json:"turbo_web"`
}
