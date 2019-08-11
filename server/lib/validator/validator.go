package validator

import (
	"fmt"

	"github.com/mgenware/go-packagex/v5/strconvx"
)

func panicMissingArg(key string) {
	// panic with a string for non-fatal errors
	panic(fmt.Sprintf("The argument `%v` is required", key))
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
	val, ok := dict[key].(int)
	if !ok {
		panicMissingArg(key)
	}
	return val
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
