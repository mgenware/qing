/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package profilep

import (
	"qing/app"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validator"
)

var vProfilePage = app.MainPageManager.MustParseView("/profile/profilePage.html")
var vProfileFeedItem = app.MainPageManager.MustParseView("/profile/feedItem.html")

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

	URL string
}

// ProfileDiscussionItem is a wrapper around DiscussionTableSelectItemsForUserProfileResult.
type ProfileDiscussionItem struct {
	da.DiscussionTableSelectItemsForUserProfileResult

	URL string
}

// NewProfilePageModelFromUser creates a new ProfileModel from profile DB result.
func NewProfilePageModelFromUser(profile *da.UserTableSelectProfileResult, stats *da.UserStatsTableSelectStatsResult, feedHTML string, pageBarHTML string) ProfilePageModel {
	d := ProfilePageModel{UserTableSelectProfileResult: *profile}
	uid := profile.ID

	d.EID = validator.EncodeID(uid)
	d.IconURL = app.URL.UserIconURL250(uid, profile.IconName)
	d.UserURL = app.URL.UserProfile(uid)
	d.PostCount = stats.PostCount
	d.DiscussionCount = stats.DiscussionCount
	d.FeedListHTML = feedHTML
	d.PageBarHTML = pageBarHTML

	d.ProfilePostsURL = app.URL.UserProfileAdv(uid, defs.Shared.KeyPosts, 1)
	d.ProfileDiscussionsURL = app.URL.UserProfileAdv(uid, defs.Shared.KeyDiscussions, 1)
	return d
}

// NewProfilePostItem creates a new ProfilePostItem from a post record.
func NewProfilePostItem(item *da.PostTableSelectItemsForUserProfileResult) ProfilePostItem {
	d := ProfilePostItem{PostTableSelectItemsForUserProfileResult: *item}
	d.URL = app.URL.Post(item.ID)
	return d
}

// NewProfileDiscussionItem creates a new ProfileDiscussionItem from a dicussion record.
func NewProfileDiscussionItem(item *da.DiscussionTableSelectItemsForUserProfileResult) ProfileDiscussionItem {
	d := ProfileDiscussionItem{DiscussionTableSelectItemsForUserProfileResult: *item}
	d.URL = app.URL.Discussion(item.ID)
	return d
}
