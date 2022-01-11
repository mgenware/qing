/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appLog

import (
	"qing/a/logx"
	"qing/app"
)

var logger app.CoreLogger

func init() {
	conf := app.CoreConfig()
	if conf.UnitTest() {
		logger = NewTestLogger()
	} else {
		var err error
		logger, err = logx.NewLogger(conf.Log.Dir, conf.DevMode())
		if err != nil {
			panic(err)
		}
	}
}

func Get() app.CoreLogger {
	return logger
}
