package validate2

import (
	"fmt"

	"github.com/mgenware/go-packagex/jsonx"
)

/** This file is build upon "github.com/mgenware/go-packagex/jsonx" with following additions:
 * > If a default value is returned, we consider it missing and panic with a string indicating a required argument is not present EXCEPT for bool.
 */

func panicMissingArg(key string) {
	panic(fmt.Sprintf("The argument `%v` is required", key))
}

// MustGetString returns the value for the key, and panics if it is not found.
func MustGetString(dict map[string]interface{}, key string) string {
	val := jsonx.GetStringOrDefault(dict, key)
	if val == "" {
		panicMissingArg(key)
	}
	return val
}

// MustGetInt returns the value for the key, and panics if it is not found.
func MustGetInt(dict map[string]interface{}, key string) int {
	val := jsonx.GetIntOrDefault(dict, key)
	if val == 0 {
		panicMissingArg(key)
	}
	return val
}

// MustGetUint returns the value for the key, and panics if it is not found.
func MustGetUint(dict map[string]interface{}, key string) uint {
	val := jsonx.GetUintOrDefault(dict, key)
	if val == 0 {
		panicMissingArg(key)
	}
	return val
}

// MustGetInt64 returns the value for the key, and panics if it is not found.
func MustGetInt64(dict map[string]interface{}, key string) int64 {
	val := jsonx.GetInt64OrDefault(dict, key)
	if val == 0 {
		panicMissingArg(key)
	}
	return val
}

// MustGetUint64 returns the value for the key, and panics if it is not found.
func MustGetUint64(dict map[string]interface{}, key string) uint64 {
	val := jsonx.GetUint64OrDefault(dict, key)
	if val == 0 {
		panicMissingArg(key)
	}
	return val
}

// MustGetFloat64 returns the value for the key, and panics if it is not found.
func MustGetFloat64(dict map[string]interface{}, key string) float64 {
	val := jsonx.GetFloat64OrDefault(dict, key)
	if val == 0 {
		panicMissingArg(key)
	}
	return val
}

// MustGetBool returns the value for the key, and panics if it is not found.
func MustGetBool(dict map[string]interface{}, key string) bool {
	// No panic for bool
	return jsonx.GetBoolOrDefault(dict, key)
}
