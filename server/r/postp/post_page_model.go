/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package postp

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
)

var vPostPage = appHandler.MainPage().MustParseView("post/postPage.html")

type PostPageModel struct {
	da.PostItem

	// Used by `postPage.html`.
	PostURL    string
	EID        string
	Liked      bool
	UserEID    string
	UserHTML   string
	CreatedAt  string
	ModifiedAt string
}

func NewPostPageModel(p *da.PostItem) PostPageModel {
	d := PostPageModel{PostItem: *p}
	eid := clib.EncodeID(p.ID)
	d.PostURL = appURL.Get().Post(p.ID)
	d.EID = eid
	d.UserEID = clib.EncodeID(d.UserID)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	pu := rcom.NewPostUserAppInput(d.UserID, d.UserName, d.UserIconName, eid, appdef.ContentBaseTypePost, d.CreatedAt, d.ModifiedAt)
	d.UserHTML = rcom.GetPostUserAppHTML(&pu)
	return d
}
