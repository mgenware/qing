/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package postp

import (
	"qing/app"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
)

var vPostPage = app.MainPageManager.MustParseView("/post/postPage.html")

// PostPageModel is a wrapper around da.PostTableSelectPostByIDResult.
type PostPageModel struct {
	da.PostTableSelectItemByIDResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	PostURL  string
	EID      string
	Liked    bool
	UserEID  string
	UserHTML string
}

// PostPageWindData ...
type PostPageWindData struct {
	EID          string
	CmtCount     uint
	InitialLikes uint
}

// NewPostPageModel creates a PostPageModel.
func NewPostPageModel(p *da.PostTableSelectItemByIDResult) PostPageModel {
	d := PostPageModel{PostTableSelectItemByIDResult: *p}
	eid := validator.EncodeID(p.ID)
	d.PostURL = app.URL.Post(p.ID)
	d.EID = eid
	d.UserEID = validator.EncodeID(d.UserID)
	d.UserHTML = rcom.GetUserItemViewHTML(d.UserID, d.UserName, d.UserIconName, eid, defs.Shared.EntityPost, d.CreatedAt, d.ModifiedAt)
	return d
}
