/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package testx

import "github.com/gomodule/redigo/redis"

// Redis ...
var Redis *redis.Conn

func init() {
	mustSetupRedis()
}

func mustSetupRedis() {
	redis := redis.NewConn(6379)
	Redis = redis
}
