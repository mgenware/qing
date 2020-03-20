package appprofile

import "runtime"

// HashingData ...
type HashingData struct {
	Memory      int `json:"memory"`
	Iterations  int `json:"iterations"`
	Parallelism int `json:"parallelism"`
	SaltLength  int `json:"salt_length"`
	KeyLength   int `json:"key_length"`
}

func newHashingData() *HashingData {
	res := &HashingData{
		Memory:      64 * 1024,
		Iterations:  3,
		SaltLength:  16,
		KeyLength:   32,
		Parallelism: runtime.NumCPU(),
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
