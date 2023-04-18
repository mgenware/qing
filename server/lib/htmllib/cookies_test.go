/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package htmllib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewCookie(t *testing.T) {
	assert := assert.New(t)
	c := NewCookie("a:我", "b:他")

	assert.Equal(c.Name, "a%3A%E6%88%91")
	assert.Equal(c.Value, "b%3A%E4%BB%96")
	assert.Equal(c.Path, "/")
}

func TestDeleteCookie(t *testing.T) {
	assert := assert.New(t)
	c := DeleteCookie("a:我")

	assert.Equal(c.Name, "a%3A%E6%88%91")
	assert.Equal(c.Value, "")
	assert.Equal(c.Path, "/")
}
