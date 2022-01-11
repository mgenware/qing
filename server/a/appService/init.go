/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appService

import (
	"qing/a/app"
	"qing/a/appLog"
	"qing/a/appMS"
	"qing/a/appProfile"
	"qing/a/servicex"
)

var service *servicex.Service

func init() {
	conf := app.CoreConfig()
	profile := appProfile.Get()
	msConn := appMS.GetConn()
	logger := appLog.Get()

	service = servicex.MustNewService(conf, profile, logger, msConn)
}

func Get() *servicex.Service {
	return service
}
