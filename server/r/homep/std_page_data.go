package homep

import (
	"fmt"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/r/rcom"
)

var vStdPage = app.MasterPageManager.MustParseLocalizedView("/home/stdPage.html")
var vStdThreadItem = app.MasterPageManager.MustParseView("/home/threadView.html")

// Should be in sync with `HomeItemType` in `homeTA.ts`.
const (
	homeItemPost       = 1
	homeItemDiscussion = 2
)

// StdPageData ...
type StdPageData struct {
	handler.LocalizedTemplateData

	FeedListHTML string
	PageBarHTML  string
	PageData     *rcom.PageData

	HomePostsURL       string
	HomeDiscussionsURL string
}

// StdPageItemData is a data wrapper around PostTableSelectItemsForUserProfileResult.
type StdPageItemData struct {
	da.HomeItemInterface

	ItemURL     string
	UserURL     string
	UserIconURL string
}

// NewStdPageData creates a new StdPageData.
func NewStdPageData(pageData *rcom.PageData, feedHTML, pageBarHTML string) *StdPageData {
	d := &StdPageData{}
	d.FeedListHTML = feedHTML
	d.PageData = pageData
	d.PageBarHTML = pageBarHTML
	d.HomePostsURL = app.URL.HomeAdv(defs.Constants.KeyPosts, 1)
	d.HomeDiscussionsURL = app.URL.HomeAdv(defs.Constants.KeyDiscussions, 1)
	return d
}

// NewStdPageItemData creates a new StdPageItemData.
func NewStdPageItemData(item *da.HomeItemInterface) (*StdPageItemData, error) {
	d := &StdPageItemData{HomeItemInterface: *item}
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
