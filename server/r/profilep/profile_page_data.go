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
	"qing/a/def/appDef"
	"qing/da"
	"qing/lib/clib"
)

var vProfilePage = appHandler.MainPage().MustParseView("profile/profilePage.html")
var vProfileFeedItem = appHandler.MainPage().MustParseView("profile/feedItem.html")

type ProfilePageData struct {
	da.UserAGSelectProfileResult

	EID          string
	UserURL      string
	IconURL      string
	FeedListHTML string
	PostCount    uint
	FPostCount   uint

	ProfilePostsURL  string
	ProfileFPostsURL string
	PageBarHTML      string
}

type ProfilePageWindData struct {
	Website string
}

type ProfilePostItemData struct {
	da.PostItemForProfile

	Link       string
	CreatedAt  string
	ModifiedAt string
}

// NewProfilePageDataFromUser creates a new ProfileData from profile DB result.
func NewProfilePageDataFromUser(profile *da.UserAGSelectProfileResult, stats *da.UserStatsAGSelectStatsResult, feedHTML string, pageBarHTML string) ProfilePageData {
	d := ProfilePageData{UserAGSelectProfileResult: *profile}
	uid := profile.ID

	d.EID = clib.EncodeID(uid)
	d.IconURL = appURL.Get().UserIconURL250(uid, profile.IconName)
	d.UserURL = appURL.Get().UserProfile(uid)
	d.PostCount = stats.PostCount
	d.FPostCount = stats.FpostCount
	d.FeedListHTML = feedHTML
	d.PageBarHTML = pageBarHTML

	d.ProfilePostsURL = appURL.Get().UserProfileAdv(uid, appDef.KeyPosts, 1)
	d.ProfileFPostsURL = appURL.Get().UserProfileAdv(uid, appDef.KeyForumPosts, 1)
	return d
}

func NewProfilePostItemData(item *da.PostItemForProfile) ProfilePostItemData {
	d := ProfilePostItemData{PostItemForProfile: *item}
	d.Link = appURL.Get().Post(item.ID)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}
