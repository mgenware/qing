/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package testx

import (
	"qing/app/extern/redisx"
)

// Redis ...
var Redis *redisx.Conn

func init() {
	mustSetupRedis()
}

func mustSetupRedis() {
	redis := redisx.NewConn(6379)
	Redis = redis
}
