package postp

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
)

// PostPageModel is a wrapper around da.PostTableSelectPostByIDResult.
type PostPageModel struct {
	da.PostTableSelectItemByIDResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	PostURL  string
	EID      string
	Liked    bool
	UserEID  string
	UserHTML string

	ProfilePostsURL       string
	ProfileDiscussionsURL string
}

var vPostPage = app.MasterPageManager.MustParseView("/post/postPage.html")

// NewPostPageModel creates a PostPageModel.
func NewPostPageModel(p *da.PostTableSelectItemByIDResult) PostPageModel {
	d := PostPageModel{PostTableSelectItemByIDResult: *p}
	eid := validator.EncodeID(p.ID)
	d.PostURL = app.URL.Post(p.ID)
	d.EID = eid
	d.UserEID = validator.EncodeID(d.UserID)
	d.UserHTML = rcom.GetUserItemViewHTML(d.UserID, d.UserName, d.UserIconName, eid, d.CreatedAt, d.ModifiedAt)
	return d
}
