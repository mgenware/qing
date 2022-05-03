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

type ProfilePageModel struct {
	da.UserAGSelectProfileResult

	EID          string
	UserURL      string
	IconURL      string
	FeedListHTML string
	PostCount    uint
	ThreadCount  uint

	ProfilePostsURL   string
	ProfileThreadsURL string
	PageBarHTML       string
}

type ProfilePageWindData struct {
	Website string
}

type ProfilePostItem struct {
	da.PostAGSelectItemsForUserProfileResult

	URL        string
	CreatedAt  string
	ModifiedAt string
}

type ProfileThreadItem struct {
	da.ThreadAGSelectItemsForUserProfileResult

	URL        string
	CreatedAt  string
	ModifiedAt string
}

// NewProfilePageModelFromUser creates a new ProfileModel from profile DB result.
func NewProfilePageModelFromUser(profile *da.UserAGSelectProfileResult, stats *da.UserStatsAGSelectStatsResult, feedHTML string, pageBarHTML string) ProfilePageModel {
	d := ProfilePageModel{UserAGSelectProfileResult: *profile}
	uid := profile.ID

	d.EID = clib.EncodeID(uid)
	d.IconURL = appURL.Get().UserIconURL250(uid, profile.IconName)
	d.UserURL = appURL.Get().UserProfile(uid)
	d.PostCount = stats.PostCount
	d.ThreadCount = stats.ThreadCount
	d.FeedListHTML = feedHTML
	d.PageBarHTML = pageBarHTML

	d.ProfilePostsURL = appURL.Get().UserProfileAdv(uid, appdef.KeyPosts, 1)
	d.ProfileThreadsURL = appURL.Get().UserProfileAdv(uid, appdef.KeyThreads, 1)
	return d
}

func NewProfilePostItem(item *da.PostAGSelectItemsForUserProfileResult) ProfilePostItem {
	d := ProfilePostItem{PostAGSelectItemsForUserProfileResult: *item}
	d.URL = appURL.Get().Post(item.ID)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}

func NewProfileThreadItem(item *da.ThreadAGSelectItemsForUserProfileResult) ProfileThreadItem {
	d := ProfileThreadItem{ThreadAGSelectItemsForUserProfileResult: *item}
	d.URL = appURL.Get().Thread(item.ID)
	return d
}
