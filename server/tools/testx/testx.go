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
