/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package clib

import (
	"fmt"
	"net/http"
	"qing/a/def/appdef"
	"unicode/utf8"

	"github.com/mgenware/goutil/jsonx"
	"github.com/mgenware/goutil/strconvx"
)

// Used in APIs to represent an entity.
type EntityInfo struct {
	ID   uint64
	Type appdef.ContentBaseType
}

func panicMissingArg(key string) {
	// panic with a string for non-fatal errors
	panic(fmt.Sprintf("The argument `%v` is required", key))
}

// MustGetUnsafeStringFromDict converts the value for the specified key to string, or panics on error.
func MustGetUnsafeStringFromDict(dict map[string]interface{}, key string) string {
	val, ok := dict[key].(string)
	if !ok {
		panicMissingArg(key)
	}
	return val
}

// MustGetStringFromDict calls MustGetUnsafeStringFromDict with an extra max length check.
func MustGetStringFromDict(dict map[string]interface{}, key string, max int) string {
	val := MustGetUnsafeStringFromDict(dict, key)
	if utf8.RuneCountInString(val) > max {
		panic(fmt.Sprintf("The argument `%v` has exceeded the max length (%v) allowed", key, max))
	}
	return val
}

// MustGetTextFromDict calls MustGetUnsafeStringFromDict with max length set to 15,000.
func MustGetTextFromDict(dict map[string]interface{}, key string) string {
	return MustGetStringFromDict(dict, key, 15000)
}

// MustGetMinMaxStringFromDict calls MustGetUnsafeStringFromDict with a length check.
func MustGetMinMaxStringFromDict(dict map[string]interface{}, key string, min, max int) string {
	val := MustGetUnsafeStringFromDict(dict, key)
	length := utf8.RuneCountInString(val)
	if length > max {
		panic(fmt.Sprintf("The argument `%v` has exceeded the max length (%v) allowed", key, max))
	}
	if length < min {
		panic(fmt.Sprintf("The argument `%v` is less than the required length (%v)", key, min))
	}
	return val
}

// MustGetDictFromDict converts the value for the specified key to map[string]interface{}, or panics on error.
func MustGetDictFromDict(dict map[string]interface{}, key string) map[string]interface{} {
	val, ok := dict[key].(map[string]interface{})
	if !ok {
		panicMissingArg(key)
	}
	return val
}

// MustGetIntFromDict converts the value for the specified key to int, or panics on error.
func MustGetIntFromDict(dict map[string]interface{}, key string) int {
	// All number types are encoded as float64.
	val, ok := dict[key].(float64)
	if !ok {
		panicMissingArg(key)
	}
	return int(val)
}

// MustGetUint64FromDict converts the value for the specified key to uint64, or panics on error.
func MustGetUint64FromDict(dict map[string]interface{}, key string) uint64 {
	// All number types are encoded as float64.
	val, ok := dict[key].(float64)
	if !ok {
		panicMissingArg(key)
	}
	return uint64(val)
}

func coercePage(page int) int {
	if page <= 0 {
		return 1
	}
	return page
}

// GetPageParamFromDict returns the page number param from the given dict.
func GetPageParamFromDict(dict map[string]interface{}) int {
	return coercePage(jsonx.GetIntOrDefault(dict, appdef.KeyPage))
}

// GetPageParamFromRequestQueryString returns the page number param from the given request.
func GetPageParamFromRequestQueryString(r *http.Request) int {
	page, _ := strconvx.ParseInt(r.FormValue(appdef.KeyPage))
	return coercePage(page)
}

// MustToPageOrDefault converts the given page string to a integer.
func MustToPageOrDefault(s string) int {
	val, err := strconvx.ParseInt(s)
	if err != nil {
		return 1
	}
	if val <= 0 {
		// panic with a string for non-fatal errors
		panic("The \"page\" argument must be a positive integer")
	}
	return val
}

// GetIDFromDict decodes the specified ID params in dictionary if exists.
func GetIDFromDict(dict map[string]interface{}, key string) uint64 {
	val, ok := dict[key].(string)
	if !ok {
		return 0
	}
	id, err := DecodeID(val)
	if err != nil {
		panic(fmt.Sprintf("The argument `%v` is not a valid ID", key))
	}
	return id
}

func GetEntityInfoFromDict(dict map[string]interface{}, key string) EntityInfo {
	dict = jsonx.GetDictOrEmpty(dict, key)
	id := GetIDFromDict(dict, "id")
	eType := jsonx.GetIntOrDefault(dict, "type")
	return EntityInfo{ID: id, Type: appdef.ContentBaseType(eType)}
}

func MustGetEntityInfoFromDict(dict map[string]interface{}, key string) EntityInfo {
	dict = jsonx.GetDictOrEmpty(dict, key)
	id := MustGetIDFromDict(dict, "id")
	eType := MustGetIntFromDict(dict, "type")
	return EntityInfo{ID: id, Type: appdef.ContentBaseType(eType)}
}

// MustGetIDFromDict decodes the specified ID params in dictionary, and panics on error.
func MustGetIDFromDict(dict map[string]interface{}, key string) uint64 {
	id := GetIDFromDict(dict, key)
	if id == 0 {
		panicMissingArg(key)
	}
	return id
}

func GetStringArrayFromDict(dict map[string]interface{}, key string) []string {
	val, ok := dict[key].([]string)
	if !ok {
		return nil
	}
	return []string(val)
}

func MustGetStringArrayFromDict(dict map[string]interface{}, key string) []string {
	val, ok := dict[key].([]string)
	if !ok {
		panicMissingArg(key)
	}
	return []string(val)
}

func GetIDArrayFromDict(dict map[string]interface{}, key string) []uint64 {
	strArray := GetStringArrayFromDict(dict, key)
	if strArray != nil {
		ids := make([]uint64, len(strArray))
		for i, idStr := range strArray {
			id, err := DecodeID(idStr)
			if err != nil {
				panic(fmt.Sprintf("The argument `%v` is not a valid ID", key))
			}
			ids[i] = id
		}
		return ids
	}
	return nil
}

func MustGetIDArrayFromDict(dict map[string]interface{}, key string) []uint64 {
	strArray := MustGetStringArrayFromDict(dict, key)
	if strArray != nil {
		ids := make([]uint64, len(strArray))
		for i, idStr := range strArray {
			id, err := DecodeID(idStr)
			if err != nil {
				panic(fmt.Sprintf("The argument `%v` is not a valid ID", key))
			}
			ids[i] = id
		}
		if len(ids) == 0 {
			panicMissingArg(key)
		}
		return ids
	}
	panicMissingArg(key)
	return nil
}
