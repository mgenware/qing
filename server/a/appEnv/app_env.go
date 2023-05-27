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

// Returns true if unit test mode is on.
func IsUT() bool {
	return os.Getenv(infraDef.UtEnv) == "1"
}

// Returns true if BR mode is on.
func IsBR() bool {
	return os.Getenv(infraDef.BrEnv) == "1"
}

func IsFirstRun() bool {
	return os.Getenv("QING_FR") == "1"
}
