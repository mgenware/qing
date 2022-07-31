/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package clib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestEncodeID(t *testing.T) {
	assert := assert.New(t)

	// Empty string for 0.
	assert.Equal(EncodeID(0), "")
	// 1-9.
	assert.Equal(EncodeID(1), "1")
	// >9
	assert.Equal(EncodeID(101), "2t")
}

func TestDecodeID(t *testing.T) {
	assert := assert.New(t)

	// Empty string for 0.
	v, err := DecodeID("")
	assert.Nil(err)
	assert.Equal(v, uint64(0))
	// 1-9.
	v, err = DecodeID("1")
	assert.Nil(err)
	assert.Equal(v, uint64(1))
	// >9
	v, err = DecodeID("2t")
	assert.Nil(err)
	assert.Equal(v, uint64(101))

	_, err = DecodeID("__")
	assert.EqualError(err, "strconv.ParseUint: parsing \"__\": invalid syntax")
}
