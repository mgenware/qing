/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package iolib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExec(t *testing.T) {
	assert := assert.New(t)

	out, err := Exec("echo", "a", "b")
	assert.Nil(err)
	assert.Equal(out, "a b\n")
}
