package extern

import (
	"fmt"
	"qing/app/cfg"
	"qing/app/extern/nl"
	"qing/app/extern/redisx"
)

type Extern struct {
	RedisConn *redisx.Conn
	NL        *nl.NL
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

	// node libs
	nlObj, err := nl.NewNL(config.Extern.NodeLibs.Dir)
	if err != nil {
		panic(fmt.Errorf("Ping to node libs failed, %v", err.Error()))
	}
	result.NL = nlObj

	return result
}
