/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appcm

import (
	"fmt"
)

// PanicOn panics if the given err is not nil.
func PanicOn(err error, info string) {
	if err != nil {
		err = fmt.Errorf("%v: %w", info, err)
		panic(err)
	}
}
