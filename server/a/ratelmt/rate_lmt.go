/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package ratelmt

import (
	"context"
	"fmt"
	"qing/a/appEnv"
	"qing/a/appMS"
	"qing/a/coretype"
	"qing/a/def"
	"strconv"

	"github.com/go-redis/redis_rate/v10"
)

type RateLmt struct {
	postCoreMain *redis_rate.Limiter
	postCoreCold *redis_rate.Limiter
}

func NewRateLmt(conn coretype.CoreMemoryStoreConn) (*RateLmt, error) {
	appMSConn, ok := conn.(*appMS.AppMSConn)
	if !ok {
		return nil, fmt.Errorf("invalid conn type")
	}

	rdb := appMSConn.RDB()
	pcMain := redis_rate.NewLimiter(rdb)
	pcCold := redis_rate.NewLimiter(rdb)
	return &RateLmt{postCoreMain: pcMain, postCoreCold: pcCold}, nil
}

func (lmt *RateLmt) RequestPostCore(uid uint64) (bool, error) {
	// Disable rate limit for BR.
	if appEnv.IsBR() {
		return true, nil
	}

	uidStr := strconv.FormatUint(uid, 10)

	msKey := fmt.Sprintf(def.MSRateLimitPostCorePerSec, uidStr)

	ctx := context.Background()
	res, err := lmt.postCoreMain.Allow(ctx, msKey, redis_rate.PerSecond(1))
	if err != nil {
		return false, err
	}
	return res.Allowed > 0, nil
}
