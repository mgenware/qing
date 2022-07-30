/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package clib

import (
	"testing"

	"github.com/mgenware/goutil/test"
)

func TestEncodeID(t *testing.T) {
	// Empty string for 0.
	test.Assert(t, EncodeID(0), "")
	// 1-9.
	test.Assert(t, EncodeID(1), "1")
	// >9
	test.Assert(t, EncodeID(101), "2t")
}

func TestDecodeID(t *testing.T) {
	// Empty string for 0.
	v, err := DecodeID("")
	test.FatalOn(err, t)
	test.Assert(t, v, uint64(0))
	// 1-9.
	v, err = DecodeID("1")
	test.FatalOn(err, t)
	test.Assert(t, v, uint64(1))
	// >9
	v, err = DecodeID("2t")
	test.FatalOn(err, t)
	test.Assert(t, v, uint64(101))
}
