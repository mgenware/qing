/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package apicom

import (
	"qing/app/appURL"
	"qing/da"
	"qing/lib/fmtx"
	"qing/sod/cmt/cmt"
)

func NewCmt(d *da.CmtData) cmt.Cmt {
	eid := fmtx.EncodeID(d.ID)
	userEID := fmtx.EncodeID(d.UserID)
	userURL := appURL.Get().UserProfile(d.UserID)
	userIconURL := appURL.Get().UserIconURL50(d.UserID, d.UserIconName)
	createdAt := fmtx.Time(d.RawCreatedAt)
	modifiedAt := fmtx.Time(d.RawModifiedAt)
	return cmt.NewCmt(d, eid, userURL, userEID, userIconURL, createdAt, modifiedAt)
}

func NewReply(d *da.CmtData) cmt.Reply {
	c := NewCmt(d)
	toUserEID := fmtx.EncodeID(d.ToUserID)
	toUserURL := appURL.Get().UserProfile(d.ToUserID)
	return cmt.NewReply(&c, toUserEID, toUserURL)
}
