package hashingalg

import (
	"qing/app/cfg"

	"github.com/mgenware/argon2id"
)

type HashingAlg struct {
	params *argon2id.Params
}

func NewHashingAlg(appProfile *cfg.AppProfile) *HashingAlg {
	hashingConfig := appProfile.Auth.Hashing
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
