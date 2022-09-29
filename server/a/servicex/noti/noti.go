/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package noti

import (
	"qing/lib/clib"
	"time"
)

const (
	NotiActionToPost = 1
	NotiActionToCmt  = 2
)

type NotiItem struct {
	From uint64
	To   uint64
	// NOTE: `PostEntity` must be a post. Cmts are not allowed, use `NotiActionToCmt` to mark it's
	// replying to a cmt.
	PostEntity clib.EntityInfo
	Action     uint8
	NavLink    string
	Created    time.Time
}
