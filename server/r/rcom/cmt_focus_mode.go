/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"database/sql"
	"qing/a/appDB"
	"qing/a/appcm"
	"qing/a/def/frozenDef"
	"qing/da"
	"qing/r/api/apicom"
	"qing/sod/cmtSod"
)

func GetCmtFocusModeData(cmtID, hostID uint64, hostType frozenDef.ContentBaseType) *cmtSod.CmtFocusModeData {
	if cmtID <= 0 {
		return nil
	}
	d := &cmtSod.CmtFocusModeData{}
	db := appDB.Get().DB()
	focusedCmtDB, err := da.Cmt.SelectCmt(db, cmtID)
	if err == sql.ErrNoRows {
		d.Is404 = true
		return d
	}
	appcm.PanicOn(err)
	focusedCmtVal := apicom.NewCmt(&focusedCmtDB)

	// Check focused cmt belongs to current post.
	if focusedCmtVal.HostID != hostID || focusedCmtVal.HostType != uint8(hostType) {
		d.Is404 = true
		return d
	}

	d.Cmt = &focusedCmtVal
	// Fetch parent cmt if needed.
	if focusedCmtVal.ParentID != nil {
		focusedCmtParentDB, err := da.Cmt.SelectCmt(db, *focusedCmtVal.ParentID)
		appcm.PanicOn(err)
		focusedCmtParentVal := apicom.NewCmt(&focusedCmtParentDB)
		d.ParentCmt = &focusedCmtParentVal
	}
	return d
}
