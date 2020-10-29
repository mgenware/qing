package profilep

import (
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/da"
)

var vProfilePage = app.TemplateManager.MustParseLocalizedView("/profile/profile.html")
var vProfilePostItem = app.TemplateManager.MustParseView("/profile/postItem.html")

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

// ProfilePostItem is a data wrapper around PostTableSelectItemsForUserProfileResult.
type ProfilePostItem struct {
	da.PostTableSelectItemsForUserProfileResult

	URL string
}

// NewProfileDataFromUser creates a new ProfileData from profile DB result.
func NewProfileDataFromUser(profile *da.UserTableSelectProfileResult, stats *da.UserStatsTableSelectStatsResult) *ProfileData {
	d := &ProfileData{UserTableSelectProfileResult: *profile}
	uid := profile.ID

	d.IconURL = app.URL.UserIconURL250(uid, profile.IconName)
	d.UserURL = app.URL.UserProfile(uid)
	d.PostCount = stats.PostCount
	return d
}

// NewProfilePostItem creates a new ProfilePostItem from post DB result.
func NewProfilePostItem(p *da.PostTableSelectItemsForUserProfileResult) *ProfilePostItem {
	d := &ProfilePostItem{PostTableSelectItemsForUserProfileResult: *p}
	d.URL = app.URL.Post(p.ID)
	return d
}
