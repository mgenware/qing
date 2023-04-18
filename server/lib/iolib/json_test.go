/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package iolib

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReadJSONFile(t *testing.T) {
	assert := assert.New(t)

	f, err := os.CreateTemp("", "ReadJSONFile")
	assert.Nil(err)

	err = WriteFile(f.Name(), []byte("{\"int\":1,\"str\":\"123四五六\"}"))
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

	val, err := os.ReadFile(f.Name())
	assert.Nil(err)
	assert.Equal(string(val), "{\"int\":1,\"str\":\"123四五六\"}")
}

type TestStruct struct {
	A string
	B []int
	C any
}

type TestStruct2 struct {
	A string `json:"a,omitempty"`
	B []int  `json:"b,omitempty"`
	C any    `json:"c,omitempty"`
}

func TestStructToJSONMap(t *testing.T) {
	child := TestStruct{
		A: "Child", B: []int{1, 2, 3},
	}
	obj := TestStruct{C: &child}
	m, err := StructToJSONMap(obj)
	if err != nil {
		t.Fatal(err)
	}

	assert := assert.New(t)
	assert.Equal(map[string]interface{}{"A": "", "B": nil, "C": map[string]interface{}{"A": "Child", "B": []interface{}{float64(1), float64(2), float64(3)}, "C": nil}}, m)
}

func TestStructToJSONMapWithTags(t *testing.T) {
	child := TestStruct2{
		A: "Child", B: []int{1, 2, 3},
	}
	obj := TestStruct2{C: &child}
	m, err := StructToJSONMap(obj)
	if err != nil {
		t.Fatal(err)
	}

	assert := assert.New(t)
	assert.Equal(map[string]interface{}{"c": map[string]interface{}{"a": "Child", "b": []interface{}{float64(1), float64(2), float64(3)}}}, m)
}
