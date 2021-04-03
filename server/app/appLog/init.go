/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appLog

import (
	"qing/app/appConfig"
	"qing/app/logx"
)

var appLog AppLog

func init() {
	conf := appConfig.Get()
	logger, err := logx.NewLogger(conf.Log.Dir, conf.DevMode())
	if err != nil {
		panic(err)
	}
	appLog = logger
}

func Get() AppLog {
	return appLog
}
