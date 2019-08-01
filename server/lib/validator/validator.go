package validator

import (
	"fmt"

	"github.com/mgenware/go-packagex/v5/jsonx"
	"github.com/mgenware/go-packagex/v5/strconvx"
)

func panicMissingArg(key string) {
	// panic with a string for non-fatal errors
	panic(fmt.Sprintf("The argument `%v` is required", key))
}

// MustGetStringFromDict returns the value for the key, and panics if it is not found.
func MustGetStringFromDict(dict map[string]interface{}, key string) string {
	val := jsonx.GetStringOrDefault(dict, key)
	if val == "" {
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
