/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package corecfg

type SiteConfig struct {
	URL   string   `json:"url,omitempty"`
	Name  string   `json:"name,omitempty"`
	Langs []string `json:"langs,omitempty"`
}
