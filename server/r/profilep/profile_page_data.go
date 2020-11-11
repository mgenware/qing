package profilep

import (
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/r/rcm"
)

var vProfilePage = app.TemplateManager.MustParseLocalizedView("/profile/profilePage.html")
var vProfilePostItem = app.TemplateManager.MustParseView("/profile/postItem.html")

// ProfilePageData ...
type ProfilePageData struct {
	da.UserTableSelectProfileResult
	handler.LocalizedTemplateData

	UserURL      string
	IconURL      string
	FeedListHTML string
	PageData     *rcm.PageData
	PostCount    uint
	ThreadCount  uint
}

// ProfilePostItem is a data wrapper around PostTableSelectItemsForUserProfileResult.
type ProfilePostItem struct {
	da.PostTableSelectItemsForUserProfileResult

	URL string
}

// NewProfilePageDataFromUser creates a new ProfileData from profile DB result.
func NewProfilePageDataFromUser(profile *da.UserTableSelectProfileResult, stats *da.UserStatsTableSelectStatsResult, feedHTML string, pageData *rcm.PageData) *ProfilePageData {
	d := &ProfilePageData{UserTableSelectProfileResult: *profile}
	uid := profile.ID

	d.IconURL = app.URL.UserIconURL250(uid, profile.IconName)
	d.UserURL = app.URL.UserProfile(uid)
	d.PostCount = stats.PostCount
	d.ThreadCount = stats.ThreadCount
	d.FeedListHTML = feedHTML
	d.PageData = pageData
	return d
}

// NewProfilePostItem creates a new ProfilePostItem from post DB result.
func NewProfilePostItem(p *da.PostTableSelectItemsForUserProfileResult) *ProfilePostItem {
	d := &ProfilePostItem{PostTableSelectItemsForUserProfileResult: *p}
	d.URL = app.URL.Post(p.ID)
	return d
}
