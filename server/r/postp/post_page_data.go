package postp

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcm"
)

// PostPageData is a wrapper around da.PostTableSelectPostByIDResult.
type PostPageData struct {
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

var vPostPage = app.TemplateManager.MustParseView("/post/postPage.html")

// NewPostPageData creates a PostPageData.
func NewPostPageData(p *da.PostTableSelectItemByIDResult) *PostPageData {
	d := &PostPageData{PostTableSelectItemByIDResult: *p}
	eid := validator.EncodeID(p.ID)
	d.PostURL = app.URL.Post(p.ID)
	d.EID = eid
	d.UserEID = validator.EncodeID(d.UserID)
	d.UserHTML = rcm.GetUserItemViewHTML(d.UserID, d.UserName, d.UserIconName, eid, d.CreatedAt, d.ModifiedAt)
	return d
}
