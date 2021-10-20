/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package postp

import (
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/app/defs"
	"qing/da"
	"qing/lib/fmtx"
	"qing/r/rcom"
)

var vPostPage = appHandler.MainPage().MustParseView("/post/postPage.html")

// PostPageModel is a wrapper around da.PostTableSelectPostByIDResult.
type PostPageModel struct {
	da.PostTableSelectItemByIDResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	PostURL    string
	EID        string
	Liked      bool
	UserEID    string
	UserHTML   string
	CreatedAt  string
	ModifiedAt string
}

// PostPageWindData ...
type PostPageWindData struct {
	EID             string
	CmtCount        uint
	InitialLikes    uint
	InitialHasLiked bool
}

// NewPostPageModel creates a PostPageModel.
func NewPostPageModel(p *da.PostTableSelectItemByIDResult) PostPageModel {
	d := PostPageModel{PostTableSelectItemByIDResult: *p}
	eid := fmtx.EncodeID(p.ID)
	d.PostURL = appURL.Get().Post(p.ID)
	d.EID = eid
	d.UserEID = fmtx.EncodeID(d.UserID)
	d.CreatedAt = fmtx.Time(d.RawCreatedAt)
	d.ModifiedAt = fmtx.Time(d.RawModifiedAt)
	d.UserHTML = rcom.GetPostUserAppHTML(d.UserID, d.UserName, d.UserIconName, eid, defs.Shared.EntityPost, d.CreatedAt, d.ModifiedAt)
	return d
}
