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
	"qing/r/rcom"
	cmtSod "qing/sod/cmt"
)

func NewCmt(d *da.CmtResult) cmtSod.Cmt {
	eid := clib.EncodeID(d.ID)
	userEID := clib.EncodeID(d.UserID)

	ep := rcom.ContentBaseExtraProps{}
	ep.UserURL = appURL.Get().UserProfile(d.UserID)
	ep.UserIconURL = appURL.Get().UserIconURL50(d.UserID, d.UserIconName)
	ep.CreatedAt = clib.TimeString(d.RawCreatedAt)
	ep.ModifiedAt = clib.TimeString(d.RawModifiedAt)

	return cmtSod.NewCmt(d, eid, userEID, nil)
}
