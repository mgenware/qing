/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"qing/a/appURL"
	"qing/lib/clib"
	"qing/sod/authSod"
)

func CreateAuthUser(id uint64, name string, iconName string) authSod.User {
	return authSod.NewUser(clib.EncodeID(id), name, appURL.Get().UserIconURL50(id, iconName), appURL.Get().UserProfile(id), false)
}
