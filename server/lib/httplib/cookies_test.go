/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package httplib

import (
	"qing/a/cfgx"
	"qing/a/cfgx/corecfg"
	"testing"

	"github.com/stretchr/testify/assert"
)

var secureCfg = createConfig(true)
var unsafeCfg = createConfig(false)

func createConfig(secure bool) *cfgx.CoreConfig {
	httpCfg := &corecfg.HTTPConfig{
		UnsafeMode: !secure,
	}
	return &cfgx.CoreConfig{
		HTTP: httpCfg,
	}
}

func TestNewCookie(t *testing.T) {
	assert := assert.New(t)
	c := NewCookie("a:我", "b:他", secureCfg)

	assert.Equal(c.Name, "a%3A%E6%88%91")
	assert.Equal(c.Value, "b%3A%E4%BB%96")
	assert.Equal(c.Path, "/")
	assert.Equal(c.Secure, true)
}

func TestNewUnsafeCookie(t *testing.T) {
	assert := assert.New(t)
	c := NewCookie("a:我", "b:他", unsafeCfg)

	assert.Equal(c.Name, "a%3A%E6%88%91")
	assert.Equal(c.Value, "b%3A%E4%BB%96")
	assert.Equal(c.Path, "/")
	assert.Equal(c.Secure, false)
}

func TestDeleteCookie(t *testing.T) {
	assert := assert.New(t)
	c := DeleteCookie("a:我")

	assert.Equal(c.Name, "a%3A%E6%88%91")
	assert.Equal(c.Value, "")
	assert.Equal(c.Path, "/")
}
