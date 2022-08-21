/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

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
