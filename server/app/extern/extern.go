/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package extern

import (
	"fmt"
	"qing/app/cfg"
	"qing/app/extern/redisx"
)

type Extern struct {
	RedisConn *redisx.Conn
}

func MustSetupExtern(config *cfg.Config) *Extern {
	result := &Extern{}
	// redis
	redisConn := redisx.NewConn(config.Extern.Redis.Port)
	err := redisConn.Ping()
	if err != nil {
		panic(fmt.Errorf("Ping to redis failed, %v", err.Error()))
	}
	result.RedisConn = redisConn

	return result
}
