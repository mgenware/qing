/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appService

import (
	"qing/app"
	"qing/app/appLog"
	"qing/app/appMS"
	"qing/app/appProfile"
	"qing/app/servicex"
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
