/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package iolib

import (
	"bytes"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCopyReaderToFile(t *testing.T) {
	assert := assert.New(t)

	f, err := os.CreateTemp("", "CopyReaderToFile")
	assert.Nil(err)

	r := bytes.NewReader([]byte{1, 2, 3})
	err = CopyReaderToFile(r, f.Name())
	assert.Nil(err)

	bytes, err := os.ReadFile(f.Name())
	assert.Nil(err)
	assert.Equal(bytes, []byte{1, 2, 3})
}
