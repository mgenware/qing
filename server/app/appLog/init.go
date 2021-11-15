/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appLog

import (
	"log"
	"qing/app"
	"qing/app/logx"
)

var appLog app.CoreLog

func init() {
	conf := app.CoreConfig()
	if conf.TestMode {
		appLog = NewTestLogger()
	} else {
		logger, err := logx.NewLogger(conf.Log.Dir, conf.DevMode())
		if err != nil {
			panic(err)
		}
		appLog = logger
		log.Printf("✅ App log: Loaded at \"%v\"", conf.Log.Dir)
	}
}

func Get() app.CoreLog {
	return appLog
}
