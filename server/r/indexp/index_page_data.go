package indexp

import (
	"fmt"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcm"
)

var vIndexPage = app.TemplateManager.MustParseLocalizedView("/index/indexPage.html")
var vIndexItem = app.TemplateManager.MustParseView("/index/indexItem.html")

// Should be in sync with `HomeItemType` in `homeTA.ts`.
const (
	indexItemPost   = 1
	indexItemThread = 2
)

// IndexPageData ...
type IndexPageData struct {
	handler.LocalizedTemplateData

	FeedListHTML string
	PageData     *rcm.PageData

	IndexPostsURL   string
	IndexThreadsURL string
}

// IndexPageItemData is a data wrapper around PostTableSelectItemsForUserProfileResult.
type IndexPageItemData struct {
	da.HomeTableTableSelectItemsResult

	URL      string
	UserHTML string
}

// NewIndexPageData creates a new ProfileData from profile DB result.
func NewIndexPageData(feedHTML string, pageData *rcm.PageData) *IndexPageData {
	d := &IndexPageData{}
	d.FeedListHTML = feedHTML
	d.PageData = pageData
	return d
}

// NewIndexPageItemData creates a new IndexPageItemData from a DB record.
func NewIndexPageItemData(item *da.HomeTableTableSelectItemsResult) (*IndexPageItemData, error) {
	d := &IndexPageItemData{HomeTableTableSelectItemsResult: *item}
	switch item.ItemType {
	case indexItemPost:
		d.URL = app.URL.Post(item.ID)
		break

	case indexItemThread:
		d.URL = app.URL.Thread(item.ID)
		break

	default:
		return nil, fmt.Errorf("Invalid item type %v", item.ItemType)
	}
	d.URL = app.URL.Post(item.ID)
	userEID := validator.EncodeID(item.UserID)
	d.UserHTML = rcm.GetUserItemViewHTML(d.UserID, d.UserName, d.UserIconName, userEID, d.CreatedAt, d.ModifiedAt)
	return d, nil
}
