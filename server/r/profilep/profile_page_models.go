/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profilep

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/defs"
	"qing/da"
	"qing/lib/fmtx"
)

var vProfilePage = appHandler.MainPage().MustParseView("/profile/profilePage.html")
var vProfileFeedItem = appHandler.MainPage().MustParseView("/profile/feedItem.html")

// ProfilePageModel ...
type ProfilePageModel struct {
	da.UserTableSelectProfileResult

	EID             string
	UserURL         string
	IconURL         string
	FeedListHTML    string
	PostCount       uint
	DiscussionCount uint

	ProfilePostsURL       string
	ProfileDiscussionsURL string
	PageBarHTML           string
}

// ProfilePageWindData ...
type ProfilePageWindData struct {
	Website string
}

// ProfilePostItem is a Model wrapper around PostTableSelectItemsForUserProfileResult.
type ProfilePostItem struct {
	da.PostTableSelectItemsForUserProfileResult

	URL        string
	CreatedAt  string
	ModifiedAt string
}

// ProfileDiscussionItem is a wrapper around DiscussionTableSelectItemsForUserProfileResult.
type ProfileDiscussionItem struct {
	da.DiscussionTableSelectItemsForUserProfileResult

	URL        string
	CreatedAt  string
	ModifiedAt string
}

// NewProfilePageModelFromUser creates a new ProfileModel from profile DB result.
func NewProfilePageModelFromUser(profile *da.UserTableSelectProfileResult, stats *da.UserStatsTableSelectStatsResult, feedHTML string, pageBarHTML string) ProfilePageModel {
	d := ProfilePageModel{UserTableSelectProfileResult: *profile}
	uid := profile.ID

	d.EID = fmtx.EncodeID(uid)
	d.IconURL = appURL.Get().UserIconURL250(uid, profile.IconName)
	d.UserURL = appURL.Get().UserProfile(uid)
	d.PostCount = stats.PostCount
	d.DiscussionCount = stats.DiscussionCount
	d.FeedListHTML = feedHTML
	d.PageBarHTML = pageBarHTML

	d.ProfilePostsURL = appURL.Get().UserProfileAdv(uid, defs.Shared.KeyPosts, 1)
	d.ProfileDiscussionsURL = appURL.Get().UserProfileAdv(uid, defs.Shared.KeyDiscussions, 1)
	return d
}

// NewProfilePostItem creates a new ProfilePostItem from a post record.
func NewProfilePostItem(item *da.PostTableSelectItemsForUserProfileResult) ProfilePostItem {
	d := ProfilePostItem{PostTableSelectItemsForUserProfileResult: *item}
	d.URL = appURL.Get().Post(item.ID)
	d.CreatedAt = fmtx.Time(d.RawCreatedAt)
	d.ModifiedAt = fmtx.Time(d.RawModifiedAt)
	return d
}

// NewProfileDiscussionItem creates a new ProfileDiscussionItem from a dicussion record.
func NewProfileDiscussionItem(item *da.DiscussionTableSelectItemsForUserProfileResult) ProfileDiscussionItem {
	d := ProfileDiscussionItem{DiscussionTableSelectItemsForUserProfileResult: *item}
	d.URL = appURL.Get().Discussion(item.ID)
	return d
}
