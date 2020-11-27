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

	UserURL         string
	IconURL         string
	FeedListHTML    string
	PageData        *rcm.PageData
	PostCount       uint
	DiscussionCount uint

	ProfilePostsURL       string
	ProfileDiscussionsURL string
}

// ProfilePostItem is a data wrapper around PostTableSelectItemsForUserProfileResult.
type ProfilePostItem struct {
	da.PostTableSelectItemsForUserProfileResult

	URL string
}

// ProfileDiscussionItem is a data wrapper around DiscussionTableSelectItemsForUserProfileResult.
type ProfileDiscussionItem struct {
	da.DiscussionTableSelectItemsForUserProfileResult

	URL string
}

// NewProfilePageDataFromUser creates a new ProfileData from profile DB result.
func NewProfilePageDataFromUser(profile *da.UserTableSelectProfileResult, stats *da.UserStatsTableSelectStatsResult, feedHTML string, pageData *rcm.PageData) *ProfilePageData {
	d := &ProfilePageData{UserTableSelectProfileResult: *profile}
	uid := profile.ID

	d.IconURL = app.URL.UserIconURL250(uid, profile.IconName)
	d.UserURL = app.URL.UserProfile(uid)
	d.PostCount = stats.PostCount
	d.DiscussionCount = stats.DiscussionCount
	d.FeedListHTML = feedHTML
	d.PageData = pageData

	d.ProfilePostsURL = app.URL.UserProfileAdv(uid, defs.Constants.KeyPosts, 1)
	d.ProfileDiscussionsURL = app.URL.UserProfileAdv(uid, defs.Constants.KeyDiscussions, 1)
	return d
}

// NewProfilePostItem creates a new ProfilePostItem from a post record.
func NewProfilePostItem(item *da.PostTableSelectItemsForUserProfileResult) *ProfilePostItem {
	d := &ProfilePostItem{PostTableSelectItemsForUserProfileResult: *item}
	d.URL = app.URL.Post(item.ID)
	return d
}

// NewProfileDiscussionItem creates a new ProfileDiscussionItem from a dicussion record.
func NewProfileDiscussionItem(item *da.DiscussionTableSelectItemsForUserProfileResult) *ProfileDiscussionItem {
	d := &ProfileDiscussionItem{DiscussionTableSelectItemsForUserProfileResult: *item}
	d.URL = app.URL.Discussion(item.ID)
	return d
}
