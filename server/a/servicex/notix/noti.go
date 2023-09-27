/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package notix

import (
	"qing/lib/clib"
	"time"
)

const (
	NotiActionToPost NotiAction = iota
	NotiActionToCmt
)

type NotiAction int

type NotiItem struct {
	From uint64
	To   uint64
	// If true, no email will be sent.
	// This corresponds to the `no_noti` field in user table.
	NoNoti bool
	// NOTE: `PostEntity` must be a post. Cmts are not allowed, use `NotiActionToCmt` to mark it's
	// replying to a cmt.
	PostEntity clib.EntityInfo
	Action     NotiAction
	NavLink    string
	Created    time.Time
}

func NewNotiItem(from, to uint64, post clib.EntityInfo, action NotiAction, navLink string, noNoti bool) NotiItem {
	return NotiItem{
		From: from, To: to, PostEntity: post, Action: action, NavLink: navLink, Created: time.Now(), NoNoti: noNoti,
	}
}
