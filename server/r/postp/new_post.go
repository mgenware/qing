package postp

import (
	"qing/app"
	"qing/app/template"
	"qing/da"
	"qing/lib/validator"
)

type PostPageData struct {
	da.PostTableSelectPostByIDResult
	template.LocalizedTemplateData

	PostURL     string
	UserEID     string
	UserURL     string
	UserIconURL string
	EID         string
	Liked       bool
}

var vPostPage = app.TemplateManager.MustParseLocalizedView("/post/postPage.html")

func NewPostPageData(p *da.PostTableSelectPostByIDResult) *PostPageData {
	d := &PostPageData{PostTableSelectPostByIDResult: *p}
	d.PostURL = app.URL.Post(p.ID)
	d.UserEID = validator.EncodeID(p.UserID)
	d.UserURL = app.URL.UserProfile(p.UserID)
	d.UserIconURL = app.URL.UserIconURL50(p.UserID, p.UserIconName)
	d.EID = validator.EncodeID(p.ID)
	return d
}
