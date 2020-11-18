package profilep

import (
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/r/rcm"
)

var vProfilePage = app.TemplateManager.MustParseLocalizedView("/profile/profilePage.html")
var vProfileFeedItem = app.TemplateManager.MustParseView("/profile/feedItem.html")

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

	ProfilePostsURL   string
	ProfileThreadsURL string
}

// ProfilePostItem is a data wrapper around PostTableSelectItemsForUserProfileResult.
type ProfilePostItem struct {
	da.PostTableSelectItemsForUserProfileResult

	URL string
}

// ProfileThreadItem is a data wrapper around ThreadTableSelectItemsForUserProfileResult.
type ProfileThreadItem struct {
	da.ThreadTableSelectItemsForUserProfileResult

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

	d.ProfilePostsURL = app.URL.UserProfileAdv(uid, defs.Constants.KeyPosts, 1)
	d.ProfileThreadsURL = app.URL.UserProfileAdv(uid, defs.Constants.KeyThreads, 1)
	return d
}

// NewProfilePostItem creates a new ProfilePostItem from a post record.
func NewProfilePostItem(item *da.PostTableSelectItemsForUserProfileResult) *ProfilePostItem {
	d := &ProfilePostItem{PostTableSelectItemsForUserProfileResult: *item}
	d.URL = app.URL.Post(item.ID)
	return d
}

// NewProfileThreadItem creates a new ProfileThreadItem from a thread record.
func NewProfileThreadItem(item *da.ThreadTableSelectItemsForUserProfileResult) *ProfileThreadItem {
	d := &ProfileThreadItem{ThreadTableSelectItemsForUserProfileResult: *item}
	d.URL = app.URL.Thread(item.ID)
	return d
}
