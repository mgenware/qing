/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appEnv

import (
	"os"
	"qing/a/def/infraDef"
)

var isUT bool
var isBR bool
var isFirstRun bool

func init() {
	isUT = os.Getenv(infraDef.UtEnv) == "1"
	isBR = os.Getenv(infraDef.BrEnv) == "1"
	isFirstRun = os.Getenv("QING_FR") == "1"
}

// Returns true if unit test mode is on.
func IsUT() bool {
	return isUT
}

// Returns true if BR mode is on.
func IsBR() bool {
	return isBR
}

func IsFirstRun() bool {
	return isFirstRun
}
