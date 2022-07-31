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

var sanitizer = NewSanitizer()

func test(s string) string {
	val, _ := sanitizer.Sanitize(s)
	return val
}

func TestSanitize(t *testing.T) {
	assert := assert.New(t)
	assert.Equal(test("<script>alert(1)</script><p>123</p>"), "<p>123</p>")
}
