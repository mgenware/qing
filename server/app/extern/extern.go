package extern

import (
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
		panic("ping to redis failed")
	}
	result.RedisConn = redisConn
	return result
}
