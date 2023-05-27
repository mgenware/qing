/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appService

import (
	"qing/a/appLog"
	"qing/a/appMS"
	"qing/a/coreConfig"
	"qing/a/servicex"
)

var service *servicex.Service

func init() {
	cc := coreConfig.Get()
	msConn := appMS.GetConn()
	logger := appLog.Get()

	service = servicex.MustNewService(cc, logger, msConn)
}

func Get() *servicex.Service {
	return service
}
