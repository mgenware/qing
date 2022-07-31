/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package clib

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func parseJSON(s string) map[string]any {
	var m map[string]any
	err := json.Unmarshal([]byte(s), &m)
	if err != nil {
		panic(err)
	}
	return m
}

func TestMustGetUnsafeStringFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := parseJSON("{\"int\":1,\"str\":\"s\"}")

	v := MustGetUnsafeStringFromDict(dict, "str")
	assert.Equal(v, "s")

	assert.PanicsWithError("the argument `int` is required", func() { MustGetUnsafeStringFromDict(dict, "int") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetUnsafeStringFromDict(dict, "__") })
}

func TestMustGetStringFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := parseJSON("{\"int\":1,\"str\":\"123四五六\"}")

	v := MustGetStringFromDict(dict, "str", 10)
	assert.Equal(v, "123四五六")

	assert.PanicsWithError("the argument `int` is required", func() { MustGetStringFromDict(dict, "int", 10) })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetStringFromDict(dict, "__", 10) })
	assert.PanicsWithError("the argument `str` has exceeded the max length (5) allowed", func() { MustGetStringFromDict(dict, "str", 5) })
}

func TestMustGetTextFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := parseJSON("{\"int\":1,\"str\":\"123四五六\"}")

	v := MustGetTextFromDict(dict, "str")
	assert.Equal(v, "123四五六")

	assert.PanicsWithError("the argument `int` is required", func() { MustGetTextFromDict(dict, "int") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetTextFromDict(dict, "__") })
}

func TestMustGetMinMaxStringFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := parseJSON("{\"int\":1,\"str\":\"123四五六\"}")

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

	dict := parseJSON("{\"int\":1,\"str\":\"123四五六\"}")

	v := MustGetIntFromDict(dict, "int")
	assert.Equal(v, 1)

	assert.PanicsWithError("the argument `str` is required", func() { MustGetIntFromDict(dict, "str") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetIntFromDict(dict, "__") })
}

func TestMustGetUint64FromDict(t *testing.T) {
	assert := assert.New(t)

	dict := parseJSON("{\"int\":1,\"str\":\"123四五六\"}")

	v := MustGetUint64FromDict(dict, "int")
	assert.Equal(v, uint64(1))

	assert.PanicsWithError("the argument `str` is required", func() { MustGetUint64FromDict(dict, "str") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetUint64FromDict(dict, "__") })
}

func TestGetPageParamFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := parseJSON("{\"page\":1,\"str\":\"123四五六\"}")

	v := GetPageParamFromDict(dict)
	assert.Equal(v, 1)
}

func TestGetIDFromDict(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(GetIDFromDict(map[string]any{"i": ""}, "i"), uint64(0))
	assert.Equal(GetIDFromDict(map[string]any{"i": ""}, "__"), uint64(0))
	assert.Equal(GetIDFromDict(map[string]any{"i": "1"}, "i"), uint64(1))
	assert.Equal(GetIDFromDict(map[string]any{"i": "2t"}, "i"), uint64(101))
	assert.PanicsWithError("the value `i -> __` is not a valid ID", func() { GetIDFromDict(map[string]any{"i": "__"}, "i") })
}

func TestMustGetIDFromDict(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(MustGetIDFromDict(map[string]any{"i": "1"}, "i"), uint64(1))
	assert.Equal(MustGetIDFromDict(map[string]any{"i": "2t"}, "i"), uint64(101))

	assert.PanicsWithError("the argument `i` is required", func() { MustGetIDFromDict(map[string]any{"i": ""}, "i") })
	assert.PanicsWithError("the argument `__` is required", func() { MustGetIDFromDict(map[string]any{"i": ""}, "__") })
}

func TestGetEntityInfoFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := parseJSON("{\"d\":{\"id\":\"2t\",\"type\":2}}")
	assert.Equal(GetEntityInfoFromDict(dict, "d"), EntityInfo{ID: 101, Type: 2})
}

func TestMustGetEntityInfoFromDict(t *testing.T) {
	assert := assert.New(t)

	dict := parseJSON("{\"d\":{\"id\":\"2t\",\"type\":2}}")
	assert.Equal(MustGetEntityInfoFromDict(dict, "d"), EntityInfo{ID: 101, Type: 2})
	assert.PanicsWithError("the argument `id` is required", func() { MustGetEntityInfoFromDict(map[string]any{"str": "s"}, "__") })
}

func TestMustCastToStringArray(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(MustCastToStringArray([]any{"a", "b"}), []string{"a", "b"})
	assert.PanicsWithError("the element `4` is not a string", func() { MustCastToStringArray([]any{"a", 4, "b"}) })
}

func TestUnsafeGetIDArrayFromDict(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(UnsafeGetIDArrayFromDict(parseJSON("{\"d\":[\"a\",\"b\"]}"), "d"), []uint64{10, 11})
	assert.PanicsWithError("the element `2` is not a string", func() { UnsafeGetIDArrayFromDict(parseJSON("{\"d\":[\"a\",2,\"b\"]}"), "d") })
}

func TestMustGetIDArrayFromDict(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(MustGetIDArrayFromDict(parseJSON("{\"d\":[\"a\",\"b\"]}"), "d"), []uint64{10, 11})
	assert.PanicsWithError("the element `2` is not a string", func() { MustGetIDArrayFromDict(parseJSON("{\"d\":[\"a\",2,\"b\"]}"), "d") })
}
