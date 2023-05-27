/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package hashingalg

import (
	"qing/a/cfgx"

	"github.com/alexedwards/argon2id"
)

type HashingAlg struct {
	params *argon2id.Params
}

func NewHashingAlg(cc *cfgx.CoreConfig) *HashingAlg {
	hashingConfig := cc.Security.Hashing
	params := &argon2id.Params{
		Memory:      hashingConfig.Memory,
		Iterations:  hashingConfig.Iterations,
		Parallelism: hashingConfig.Parallelism,
		SaltLength:  hashingConfig.SaltLength,
		KeyLength:   hashingConfig.KeyLength,
	}
	return &HashingAlg{params: params}
}

func (alg *HashingAlg) CreateHash(password string) (hash string, err error) {
	return argon2id.CreateHash(password, alg.params)
}

func (alg *HashingAlg) ComparePasswordAndHash(password, hash string) (bool, error) {
	return argon2id.ComparePasswordAndHash(password, hash)
}
