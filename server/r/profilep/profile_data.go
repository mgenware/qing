package profilep

import (
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/da"
)

var vProfilePage = app.TemplateManager.MustParseLocalizedView("/profile/profile.html")
var vProfilePostItem = app.TemplateManager.MustParseLocalizedView("/profile/postItem.html")

// ProfileData ...
type ProfileData struct {
	da.UserTableSelectProfileResult
	handler.LocalizedTemplateData

	UserURL      string
	IconURL      string
	FeedListHTML string
	Pager        *cm.Pager
	PostCount    uint
}

type PostItem struct {
	handler.LocalizedTemplateData
	da.PostTableSelectPostsForUserProfileResult

	URL string
}

func NewProfileDataFromUser(profile *da.UserTableSelectProfileResult, stats *da.UserStatsTableSelectStatsResult) *ProfileData {
	d := &ProfileData{UserTableSelectProfileResult: *profile}
	uid := profile.ID

	d.IconURL = app.URL.UserIconURL250(uid, profile.IconName)
	d.UserURL = app.URL.UserProfile(uid)
	d.PostCount = stats.PostCount
	return d
}

func NewPostItem(p *da.PostTableSelectPostsForUserProfileResult) *PostItem {
	d := &PostItem{PostTableSelectPostsForUserProfileResult: *p}
	d.URL = app.URL.Post(p.ID)
	return d
}
