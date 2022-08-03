/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package iolib

import (
	"io/ioutil"
	"os"
	"testing"

	"github.com/mgenware/goutil/iox"
	"github.com/stretchr/testify/assert"
)

func TestReadJSONFile(t *testing.T) {
	assert := assert.New(t)

	f, err := os.CreateTemp("", "ReadJSONFile")
	assert.Nil(err)

	err = ioutil.WriteFile(f.Name(), []byte("{\"int\":1,\"str\":\"123四五六\"}"), iox.DefaultFilePerm)
	assert.Nil(err)

	var v map[string]any
	err = ReadJSONFile(f.Name(), &v)
	assert.Nil(err)
	assert.Equal(v, map[string]any{"int": float64(1), "str": "123四五六"})
}

func TestWriteJSONFile(t *testing.T) {
	assert := assert.New(t)

	f, err := os.CreateTemp("", "WriteJSONFile")
	assert.Nil(err)

	err = WriteJSONFile(f.Name(), map[string]any{"int": float64(1), "str": "123四五六"})
	assert.Nil(err)

	val, err := ioutil.ReadFile(f.Name())
	assert.Nil(err)
	assert.Equal(string(val), "{\"int\":1,\"str\":\"123四五六\"}")
}