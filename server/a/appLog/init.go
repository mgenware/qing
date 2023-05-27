/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appLog

import (
	"qing/a/appEnv"
	"qing/a/coreConfig"
	"qing/a/coretype"
	"qing/a/logx"
)

var logger coretype.CoreLogger

func init() {
	config := coreConfig.Get()
	if appEnv.IsUT() {
		logger = NewTestLogger()
	} else {
		var err error
		logger, err = logx.NewLogger(config.Log.Dir, config.DevMode() && !appEnv.IsBR())
		if err != nil {
			panic(err)
		}
	}
}

func Get() coretype.CoreLogger {
	return logger
}
