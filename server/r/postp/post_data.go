package postp

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
)

// PostPageData is a wrapper around da.PostTableSelectPostByIDResult.
type PostPageData struct {
	da.PostTableSelectItemByIDResult

	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	PostURL     string
	UserEID     string
	UserURL     string
	UserIconURL string
	EID         string
	Liked       bool
}

var vPostPage = app.TemplateManager.MustParseView("/post/postPage.html")

// NewPostPageData creates a PostPageData.
func NewPostPageData(p *da.PostTableSelectItemByIDResult) *PostPageData {
	d := &PostPageData{PostTableSelectItemByIDResult: *p}
	d.PostURL = app.URL.Post(p.ID)
	d.UserEID = validator.EncodeID(p.UserID)
	d.UserURL = app.URL.UserProfile(p.UserID)
	d.UserIconURL = app.URL.UserIconURL50(p.UserID, p.UserIconName)
	d.EID = validator.EncodeID(p.ID)
	return d
}
