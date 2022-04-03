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
	"qing/a/def/appdef"
	"qing/da"
	"qing/lib/clib"
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

	ProfilePostsURL   string
	ProfileThreadsURL string
	PageBarHTML       string
}

type ProfilePageWindData struct {
	Website string
}

type ProfilePostItem struct {
	da.PostTableSelectItemsForUserProfileResult

	URL        string
	CreatedAt  string
	ModifiedAt string
}

type ProfileThreadItem struct {
	da.ThreadTableSelectItemsForUserProfileResult

	URL        string
	CreatedAt  string
	ModifiedAt string
}

// NewProfilePageModelFromUser creates a new ProfileModel from profile DB result.
func NewProfilePageModelFromUser(profile *da.UserTableSelectProfileResult, stats *da.UserStatsTableSelectStatsResult, feedHTML string, pageBarHTML string) ProfilePageModel {
	d := ProfilePageModel{UserTableSelectProfileResult: *profile}
	uid := profile.ID

	d.EID = clib.EncodeID(uid)
	d.IconURL = appURL.Get().UserIconURL250(uid, profile.IconName)
	d.UserURL = appURL.Get().UserProfile(uid)
	d.PostCount = stats.PostCount
	d.DiscussionCount = stats.ThreadCount
	d.FeedListHTML = feedHTML
	d.PageBarHTML = pageBarHTML

	d.ProfilePostsURL = appURL.Get().UserProfileAdv(uid, appdef.KeyPosts, 1)
	d.ProfileThreadsURL = appURL.Get().UserProfileAdv(uid, appdef.KeyThreads, 1)
	return d
}

func NewProfilePostItem(item *da.PostTableSelectItemsForUserProfileResult) ProfilePostItem {
	d := ProfilePostItem{PostTableSelectItemsForUserProfileResult: *item}
	d.URL = appURL.Get().Post(item.ID)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}

func NewProfileThreadItem(item *da.ThreadTableSelectItemsForUserProfileResult) ProfileThreadItem {
	d := ProfileThreadItem{ThreadTableSelectItemsForUserProfileResult: *item}
	d.URL = appURL.Get().Thread(item.ID)
	return d
}
