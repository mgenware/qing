package indexp

import (
	"fmt"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/r/rcm"
)

var vIndexPage = app.TemplateManager.MustParseLocalizedView("/index/indexPage.html")
var vIndexItem = app.TemplateManager.MustParseView("/index/indexItem.html")

// Should be in sync with `HomeItemType` in `homeTA.ts`.
const (
	indexItemPost       = 1
	indexItemDiscussion = 2
)

// IndexPageData ...
type IndexPageData struct {
	handler.LocalizedTemplateData

	FeedListHTML string
	PageBarHTML  string
	PageData     *rcm.PageData

	IndexPostsURL       string
	IndexDiscussionsURL string
}

// IndexPageItemData is a data wrapper around PostTableSelectItemsForUserProfileResult.
type IndexPageItemData struct {
	da.HomeTableTableSelectItemsResult

	ItemURL     string
	UserURL     string
	UserIconURL string
}

// NewIndexPageData creates a new ProfileData from profile DB result.
func NewIndexPageData(pageData *rcm.PageData, feedHTML, pageBarHTML string) *IndexPageData {
	d := &IndexPageData{}
	d.FeedListHTML = feedHTML
	d.PageData = pageData
	d.PageBarHTML = pageBarHTML
	d.IndexPostsURL = app.URL.IndexAdv(defs.Constants.KeyPosts, 1)
	d.IndexDiscussionsURL = app.URL.IndexAdv(defs.Constants.KeyDiscussions, 1)
	return d
}

// NewIndexPageItemData creates a new IndexPageItemData from a DB record.
func NewIndexPageItemData(item *da.HomeTableTableSelectItemsResult) (*IndexPageItemData, error) {
	d := &IndexPageItemData{HomeTableTableSelectItemsResult: *item}
	switch item.ItemType {
	case indexItemPost:
		d.ItemURL = app.URL.Post(item.ID)
		break

	case indexItemDiscussion:
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
