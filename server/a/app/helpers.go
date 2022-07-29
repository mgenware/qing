package app

import (
	"fmt"
	"testing"
)

// PanicOn panics if the given err is not nil.
func PanicOn(err error) {
	if err != nil {
		panic(err)
	}
}

// PanicOnEx panics if the given err is not nil.
func PanicOnEx(err error, info string) {
	if err != nil {
		err = fmt.Errorf("%v: %v", info, err)
		panic(err)
	}
}

// FatalOn calls t.Fatal if the given error is not nil.
func FatalOn(err error, t *testing.T) {
	if err != nil {
		t.Fatal(err)
	}
}
