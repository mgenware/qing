/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package corecfg

type HashingConfig struct {
	Memory      uint32 `json:"memory"`
	Iterations  uint32 `json:"iterations"`
	Parallelism uint8  `json:"parallelism"`
	SaltLength  uint32 `json:"salt_length"`
	KeyLength   uint32 `json:"key_length"`
}

type RateLimitConfig struct {
	RealIPHeader string `json:"real_ip_header,omitempty"`
}

type SecurityConfig struct {
	Hashing   *HashingConfig   `json:"hashing,omitempty"`
	RateLimit *RateLimitConfig `json:"rate_limit,omitempty"`
}
