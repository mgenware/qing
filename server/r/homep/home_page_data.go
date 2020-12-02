package homep

import (
	"fmt"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/r/rcm"
)

var vHomePage = app.MasterPageManager.MustParseLocalizedView("/home/homePage.html")
var vHomeItem = app.MasterPageManager.MustParseView("/home/homeItem.html")

// Should be in sync with `HomeItemType` in `homeTA.ts`.
const (
	homeItemPost       = 1
	homeItemDiscussion = 2
)

// HomePageData ...
type HomePageData struct {
	handler.LocalizedTemplateData

	FeedListHTML string
	PageBarHTML  string
	PageData     *rcm.PageData

	HomePostsURL       string
	HomeDiscussionsURL string
}

// HomePageItemData is a data wrapper around PostTableSelectItemsForUserProfileResult.
type HomePageItemData struct {
	da.HomeItemInterface

	ItemURL     string
	UserURL     string
	UserIconURL string
}

// NewHomePageData creates a new ProfileData from profile DB result.
func NewHomePageData(pageData *rcm.PageData, feedHTML, pageBarHTML string) *HomePageData {
	d := &HomePageData{}
	d.FeedListHTML = feedHTML
	d.PageData = pageData
	d.PageBarHTML = pageBarHTML
	d.HomePostsURL = app.URL.HomeAdv(defs.Constants.KeyPosts, 1)
	d.HomeDiscussionsURL = app.URL.HomeAdv(defs.Constants.KeyDiscussions, 1)
	return d
}

// NewHomePageItemData creates a new HomePageItemData from a DB record.
func NewHomePageItemData(item *da.HomeItemInterface) (*HomePageItemData, error) {
	d := &HomePageItemData{HomeItemInterface: *item}
	switch item.ItemType {
	case homeItemPost:
		d.ItemURL = app.URL.Post(item.ID)
		break

	case homeItemDiscussion:
		d.ItemURL = app.URL.Discussion(item.ID)
		break

	default:
		return nil, fmt.Errorf("Invalid item type %v", item.ItemType)
	}
	uid := item.UserID
	d.UserURL = app.URL.UserProfile(uid)
	d.UserIconURL = app.URL.UserIconURL50(uid, item.UserIconName)
	return d, nil
}
