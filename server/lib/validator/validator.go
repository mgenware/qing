package validator

import (
	"fmt"
	"strconv"

	"github.com/mgenware/go-packagex/v5/strconvx"
)

func panicMissingArg(key string) {
	// panic with a string for non-fatal errors
	panic(fmt.Sprintf("The argument `%v` is required", key))
}

// EncodeID encodes the given integer ID to a string ID.
func EncodeID(id uint64) string {
	return strconv.FormatUint(id, 36)
}

// DecodeID decodes the given string ID to a integer ID.
func DecodeID(str string) (uint64, error) {
	return strconv.ParseUint(str, 36, 64)
}

// MustGetStringFromDict converts the value for the specified key to string, and panics on error.
func MustGetStringFromDict(dict map[string]interface{}, key string) string {
	val, ok := dict[key].(string)
	if !ok {
		panicMissingArg(key)
	}
	return val
}

// MustGetDictFromDict converts the value for the specified key to map[string]interface{}, and panics on error.
func MustGetDictFromDict(dict map[string]interface{}, key string) map[string]interface{} {
	val, ok := dict[key].(map[string]interface{})
	if !ok {
		panicMissingArg(key)
	}
	return val
}

// MustGetIntFromDict converts the value for the specified key to int, and panics on error.
func MustGetIntFromDict(dict map[string]interface{}, key string) int {
	// All number types are encoded as float64.
	val, ok := dict[key].(float64)
	if !ok {
		panicMissingArg(key)
	}
	return int(val)
}

// MustToPageOrDefault converts the given page string to a integer.
func MustToPageOrDefault(s string) int {
	val, err := strconvx.ParseInt(s)
	if err != nil {
		return 1
	}
	if val <= 0 {
		// panic with a string for non-fatal errors
		panic("The \"page\" arugment must be a positive integer")
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
		panic(fmt.Sprintf("The parameter %v is not a valid ID", key))
	}
	return id
}

// MustGetIDFromDict decodes the specified ID params in dictionary, and panics on error.
func MustGetIDFromDict(dict map[string]interface{}, key string) uint64 {
	id := GetIDFromDict(dict, key)
	if id == 0 {
		panicMissingArg(key)
	}
	return id
}
