package app

import (
	"fmt"
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
