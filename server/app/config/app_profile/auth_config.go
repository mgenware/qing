/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package approfile

// HashingData ...
type HashingData struct {
	Memory      uint32 `json:"memory"`
	Iterations  uint32 `json:"iterations"`
	Parallelism uint8  `json:"parallelism"`
	SaltLength  uint32 `json:"salt_length"`
	KeyLength   uint32 `json:"key_length"`
}

func newHashingData() *HashingData {
	res := &HashingData{
		Memory:      64 * 1024,
		Iterations:  3,
		SaltLength:  16,
		KeyLength:   32,
		Parallelism: 2,
	}
	return res
}

// AuthData ...
type AuthData struct {
	Hashing *HashingData `json:"hashing"`
}

// NewAuthData creates an AuthData.
func NewAuthData() *AuthData {
	res := &AuthData{
		Hashing: newHashingData(),
	}
	return res
}
