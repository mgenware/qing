package app

import "fmt"

// PanicIfErr panics if the given err is not nil.
func PanicIfErr(err error) {
	if err != nil {
		panic(err)
	}
}

// PanicIfErrEx panics if the given err is not nil.
func PanicIfErrEx(err error, info string) {
	if err != nil {
		err = fmt.Errorf("%v: %v", info, err)
		panic(err)
	}
}
