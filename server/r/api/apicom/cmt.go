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
	"qing/lib/validator"
)

type Cmt struct {
	da.CmtData

	EID         string `json:"id"`
	UserEID     string `json:"userID,omitempty"`
	UserURL     string `json:"userURL,omitempty"`
	UserIconURL string `json:"userIconURL,omitempty"`
}

func NewCmt(d *da.CmtData) Cmt {
	r := Cmt{CmtData: *d}
	r.EID = validator.EncodeID(d.CmtID)
	r.UserEID = validator.EncodeID(d.UserID)
	r.UserURL = appURL.Get().UserProfile(r.UserID)
	r.UserIconURL = appURL.Get().UserIconURL50(r.UserID, r.UserIconName)
	return r
}

type Reply struct {
	da.ReplyData

	EID         string `json:"id"`
	UserEID     string `json:"userID,omitempty"`
	ToUserEID   string `json:"toUserID,omitempty"`
	UserURL     string `json:"userURL,omitempty"`
	UserIconURL string `json:"userIconURL,omitempty"`
	ToUserURL   string `json:"toUserURL,omitempty"`
}

func NewReply(d *da.ReplyData) Reply {
	r := Reply{ReplyData: *d}
	r.EID = validator.EncodeID(d.ID)
	r.UserEID = validator.EncodeID(d.UserID)
	r.ToUserEID = validator.EncodeID(d.ToUserID)
	r.UserURL = appURL.Get().UserProfile(r.UserID)
	r.UserIconURL = appURL.Get().UserIconURL50(r.UserID, r.UserIconName)
	r.ToUserURL = appURL.Get().UserProfile(r.ToUserID)
	return r
}
