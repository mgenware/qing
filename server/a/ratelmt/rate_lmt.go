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
	"net/http"
	"qing/a/appEnv"
	"qing/a/appMS"
	"qing/a/cfgx"
	"qing/a/coretype"
	"qing/a/def"
	"qing/lib/httplib"
	"strconv"

	"github.com/go-redis/redis_rate/v10"
)

type RateLmt struct {
	postCoreMain *redis_rate.Limiter
	postCoreCold *redis_rate.Limiter

	realIPHeader string
}

func NewRateLmt(cfg *cfgx.CoreConfig, conn coretype.CoreMemoryStoreConn) (*RateLmt, error) {
	appMSConn, ok := conn.(*appMS.AppMSConn)
	if !ok {
		return nil, fmt.Errorf("invalid conn type")
	}

	rdb := appMSConn.RDB()
	pcMain := redis_rate.NewLimiter(rdb)
	pcCold := redis_rate.NewLimiter(rdb)

	// Note that c could be nil.
	c := cfg.Security.RateLimit
	realIPHeader := ""
	if c != nil {
		realIPHeader = c.RealIPHeader
	}
	return &RateLmt{
		postCoreMain: pcMain,
		postCoreCold: pcCold,
		realIPHeader: realIPHeader,
	}, nil
}

func (lmt *RateLmt) RequestPostCore(uid uint64) (bool, error) {
	if appEnv.IsBR() {
		return true, nil
	}

	uidStr := strconv.FormatUint(uid, 10)

	msKey := fmt.Sprintf(def.MSRateLimitPostCorePerSecKey, uidStr)

	ctx := context.Background()
	res, err := lmt.postCoreMain.Allow(ctx, msKey, redis_rate.PerSecond(1))
	if err != nil {
		return false, err
	}
	return res.Allowed > 0, nil
}

func (lmt *RateLmt) RequestSignUp(r *http.Request) (bool, error) {
	if appEnv.IsBR() {
		return true, nil
	}

	if lmt.realIPHeader == "" {
		return true, nil
	}

	ip, err := httplib.GetRealIP(r, lmt.realIPHeader)
	if err != nil {
		return false, err
	}
	if ip == "" {
		return true, nil
	}

	msKey := fmt.Sprintf(def.MSRateLimitSignUpPerMinKey, ip)

	ctx := context.Background()
	res, err := lmt.postCoreMain.Allow(ctx, msKey, redis_rate.PerMinute(10))
	if err != nil {
		return false, err
	}
	return res.Allowed > 0, nil
}
