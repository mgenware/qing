/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package ratelmt

import (
	"context"
	"strconv"
	"time"

	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
)

type RateLmt struct {
	core limiter.Store
}

func NewRateLmt() (*RateLmt, error) {
	core, err := memorystore.New(&memorystore.Config{
		// Number of tokens allowed per interval.
		Tokens: 1,
		// Interval until tokens reset.
		Interval: time.Minute,
	})
	if err != nil {
		return nil, err
	}
	return &RateLmt{core: core}, nil
}

func (lmt *RateLmt) TakeFromUID(uid uint64) (bool, error) {
	uidStr := strconv.FormatUint(uid, 10)
	_, _, _, ok, err := lmt.core.Take(context.Background(), uidStr)
	return ok, err
}
