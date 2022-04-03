/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package threadp

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
)

var vThreadApp = appHandler.MainPage().MustParseView("/thread/threadApp.html")

type ThreadAppModel struct {
	da.ThreadTableSelectItemByIDResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	ThreadURL   string
	EID         string
	ForumEID    string
	Liked       bool
	UserEID     string
	UserHTML    string
	CreatedAt   string
	ModifiedAt  string
	HasLikedNum int
}

func NewThreadAppModel(p *da.ThreadTableSelectItemByIDResult, hasLiked bool) ThreadAppModel {
	d := ThreadAppModel{ThreadTableSelectItemByIDResult: *p}
	eid := clib.EncodeID(p.ID)
	d.ThreadURL = appURL.Get().Thread(p.ID)
	d.EID = eid
	if d.ForumID != nil {
		d.ForumEID = clib.EncodeID(*d.ForumID)
	}
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	d.UserEID = clib.EncodeID(d.UserID)
	pu := rcom.NewPostUserAppInput(d.UserID, d.UserName, d.UserIconName, eid, appdef.ContentBaseTypeThread, d.CreatedAt, d.ModifiedAt)
	d.UserHTML = rcom.GetPostUserAppHTML(&pu)
	if hasLiked {
		d.HasLikedNum = 1
	}
	return d
}
