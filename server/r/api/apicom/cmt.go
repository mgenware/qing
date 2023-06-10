/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package apicom

import (
	"qing/a/appURL"
	"qing/da"
	"qing/lib/clib"
	"qing/sod/cmtSod"
)

func NewCmt(d *da.DBCmt) cmtSod.Cmt {
	eid := clib.EncodeID(d.ID)
	var userEID *string
	var userURL string
	var userIconURL string
	var parentEID *string
	if d.UserID != nil && d.UserIconName != nil {
		id := clib.EncodeID(*d.UserID)
		userEID = &id
		userURL = appURL.Get().UserProfile(*d.UserID)
		userIconURL = appURL.Get().UserIconURL50(*d.UserID, *d.UserIconName)
	}
	if d.ParentID != nil {
		pid := clib.EncodeID(*d.ParentID)
		parentEID = &pid
	}

	createdAt := clib.TimeString(d.RawCreatedAt)
	modifiedAt := clib.TimeString(d.RawModifiedAt)

	return cmtSod.NewCmt(
		d, eid, userEID, userURL, userIconURL, createdAt, modifiedAt, parentEID,
	)
}
