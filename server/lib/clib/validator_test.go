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

func TestMustGetUnsafeStringFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := map[string]any{"int": 1, "str": "s"}

	v := MustGetUnsafeStringFromDict(dict, "str")
	assert.Equal(v, "s")

	assert.PanicsWithError("the argument `int` is required", func() { MustGetUnsafeStringFromDict(dict, "int") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetUnsafeStringFromDict(dict, "__") })
}

func TestMustGetStringFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := map[string]any{"int": 1, "str": "123456"}

	v := MustGetStringFromDict(dict, "str", 10)
	assert.Equal(v, "123456")

	assert.PanicsWithError("the argument `int` is required", func() { MustGetStringFromDict(dict, "int", 10) })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetStringFromDict(dict, "__", 10) })
	assert.PanicsWithError("the argument `str` has exceeded the max length (5) allowed", func() { MustGetStringFromDict(dict, "str", 5) })
}

func TestMustGetTextFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := map[string]any{"int": 1, "str": "123456"}

	v := MustGetTextFromDict(dict, "str")
	assert.Equal(v, "123456")

	assert.PanicsWithError("the argument `int` is required", func() { MustGetTextFromDict(dict, "int") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetTextFromDict(dict, "__") })
}

func TestMustGetMinMaxStringFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := map[string]any{"int": 1, "str": "123四五六"}

	v := MustGetMinMaxStringFromDict(dict, "str", 3, 10)
	assert.Equal(v, "123四五六")

	assert.PanicsWithError("the argument `int` is required", func() { MustGetMinMaxStringFromDict(dict, "int", 3, 10) })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetMinMaxStringFromDict(dict, "__", 3, 10) })
	assert.PanicsWithError("the argument `str` is less than the required length 7", func() { MustGetMinMaxStringFromDict(dict, "str", 7, 10) })
	assert.PanicsWithError("the argument `str` has exceeded the max allowed length 5", func() { MustGetMinMaxStringFromDict(dict, "str", 1, 5) })
}

func TestMustGetDictFromDict(t *testing.T) {
	assert := assert.New(t)

	innerDict := map[string]any{"int": 1, "str": "123456"}
	dict := map[string]any{"int": 1, "dict": innerDict}

	v := MustGetDictFromDict(dict, "dict")
	assert.Equal(v, innerDict)

	assert.PanicsWithError("the argument `int` is required", func() { MustGetDictFromDict(dict, "int") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetDictFromDict(dict, "__") })
}

func TestMustGetIntFromDict(t *testing.T) {
	assert := assert.New(t)

	// All number types are encoded as float64.
	dict := map[string]any{"int": float64(1), "str": "s"}

	v := MustGetIntFromDict(dict, "int")
	assert.Equal(v, 1)

	assert.PanicsWithError("the argument `str` is required", func() { MustGetIntFromDict(dict, "str") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetIntFromDict(dict, "__") })
}

func TestMustGetUint64FromDict(t *testing.T) {
	assert := assert.New(t)

	dict := map[string]any{"uint": uint64(1), "str": "s"}

	v := MustGetUint64FromDict(dict, "int")
	assert.Equal(v, uint64(1))

	assert.PanicsWithError("the argument `str` is required", func() { MustGetUint64FromDict(dict, "str") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetUint64FromDict(dict, "__") })
}

func TestGetPageParamFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := map[string]any{"page": 1, "str": "s"}

	v := GetPageParamFromDict(dict)
	assert.Equal(v, 1)

	assert.PanicsWithError("the argument `page` is required", func() { GetPageParamFromDict(map[string]any{"str": "s"}) })
}

func TestGetIDFromDict(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(GetIDFromDict(map[string]any{"i": ""}, "i"), uint64(0))
	assert.Equal(GetIDFromDict(map[string]any{"i": ""}, "__"), uint64(0))
	assert.Equal(GetIDFromDict(map[string]any{"i": "1"}, "i"), uint64(1))
	assert.Equal(GetIDFromDict(map[string]any{"i": "2t"}, "i"), uint64(101))
	assert.PanicsWithError("the value `i -> __` is not a valid ID", func() { GetIDFromDict(map[string]any{"i": "__"}, "i") })
}

func TestGetEntityInfoFromDict(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(GetEntityInfoFromDict(map[string]any{"d": map[string]any{"id": "2t", "type": 2}}, "d"), EntityInfo{ID: 101, Type: 2})
}

func TestMustGetEntityInfoFromDict(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(MustGetEntityInfoFromDict(map[string]any{"d": map[string]any{"id": "2t", "type": 2}}, "d"), EntityInfo{ID: 101, Type: 2})
	assert.PanicsWithError("the argument `d` is required", func() { MustGetEntityInfoFromDict(map[string]any{"str": "s"}, "__") })
}
