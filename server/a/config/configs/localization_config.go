/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package configs

// LocalizationConfig ...
type LocalizationConfig struct {
	Dir   string   `json:"dir,omitempty"`
	Langs []string `json:"langs,omitempty"`
}

// Returns true if there's more than 1 language in `LocalizationConfig`.
func (cfg *LocalizationConfig) MultipleLangs() bool {
	return len(cfg.Langs) > 1
}
