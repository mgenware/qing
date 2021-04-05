/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConfig

import (
	"qing/app/config"
	"qing/app/config/configs"
)

func getUnitTestConfig() *config.Config {
	conf := &config.Config{
		IsUnitTesting: true,
		Templates: &configs.TemplatesConfig{
			Dir: "../web/templates",
		},
	}
	return conf
}
