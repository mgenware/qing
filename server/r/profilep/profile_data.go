package profilep

import (
	"qing/app"
	"qing/app/cm"
	"qing/app/template"
	"qing/da"
)

var vProfilePage = app.TemplateManager.MustParseLocalizedView("/profile/profile.html")
var vProfilePostItem = app.TemplateManager.MustParseLocalizedView("/profile/postItem.html")

type ProfileData struct {
	da.UserTableSelectProfileResult
	template.LocalizedTemplateData

	UserURL      string
	IconURL      string
	FeedListHTML string
	Pager        *cm.Pager
}

type PostItem struct {
	template.LocalizedTemplateData
	da.PostTableSelectPostsByUserResult

	URL string
}

func NewProfileDataFromUser(u *da.UserTableSelectProfileResult) *ProfileData {
	d := &ProfileData{UserTableSelectProfileResult: *u}
	uid := u.ID

	d.IconURL = app.URL.UserIconURL250(uid, u.IconName)
	d.UserURL = app.URL.UserProfile(uid)

	return d
}

func NewPostItem(p *da.PostTableSelectPostsByUserResult) *PostItem {
	d := &PostItem{PostTableSelectPostsByUserResult: *p}
	d.URL = app.URL.Post(p.ID)
	return d
}
