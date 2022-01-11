/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package limitpost

import (
	"fmt"
	"qing/a/defs"
	"qing/a/extern/redisx"
	"time"

	"github.com/gomodule/redigo/redis"
)

// Service is used to limit how many posts a user can create during a given time period.
type Service struct {
	count   int
	timeout int
	conn    *redisx.Conn
}

// NewService creates a new Service.
func NewService(conn *redisx.Conn, count, timeout int) *Service {
	return &Service{conn: conn, count: count, timeout: timeout}
}

// Post returns false if the given user is not allowed post at current period.
func (sv *Service) Post(uid uint64) (bool, error) {
	key := sv.getKey(uid)
	allowed, err := sv.isAllowed(key)
	if err != nil {
		return false, err
	}
	if !allowed {
		return false, nil
	}
	err = sv.postCore(key)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (sv *Service) isAllowed(key string) (bool, error) {
	return sv.conn.Exist(key)
}

func (sv *Service) postCore(key string) error {
	c := sv.conn.Pool().Get()
	defer c.Close()

	c.Send("MULTI")
	c.Send("INCR", key)
	c.Send("EXPIRE", key, defs.MSLimitPostingTimeout)
	_, err := redis.Values(c.Do("EXEC"))
	return err
}

func (sv *Service) getKey(uid uint64) string {
	min := time.Now().Minute()
	return fmt.Sprintf(defs.MSLimitPosting, uid, min)
}
