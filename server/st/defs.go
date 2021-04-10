/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package st

import "time"

const (
	UserID  = 101
	UserEID = "2t"
)

var Date time.Time

func init() {
	dt, err := time.Parse(time.RFC3339, "1990-10-27T10:11:12+00:00")
	if err != nil {
		panic(err)
	}
	Date = dt
}
