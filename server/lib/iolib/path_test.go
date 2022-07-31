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

func TestIsImageFile(t *testing.T) {
	assert := assert.New(t)

	assert.True(IsImageFile("abc/a.jpg"))
	assert.True(IsImageFile("abc/a.JPG"))
	assert.True(IsImageFile("abc/a.JPEG"))
	assert.True(IsImageFile("abc/a.png"))
	assert.True(IsImageFile("abc/a.webp"))
	assert.True(IsImageFile("abc/a.jfif"))

	assert.False(IsImageFile("abc/a.bmp"))
	assert.False(IsImageFile("abc/a.gif"))
}
