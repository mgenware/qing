package homep

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
	"sort"
	"strings"
)

const defaultPageSize = 10

// HomeHandler handles home page requests.
func HomeHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	db := app.DB

	// Non-forums mode.
	if !app.SetupConfig().ForumsMode {
		page := validator.GetPageParamFromRequestQueryString(r)
		tab := r.FormValue(defs.Constants.KeyTab)
		resp := app.HTMLResponse(w, r)

		var items []*da.HomeItemInterface
		var hasNext bool
		var err error

		if tab == defs.Constants.KeyPosts {
			items, hasNext, err = da.Home.SelectPosts(db, page, defaultPageSize)
		} else if tab == defs.Constants.KeyDiscussions {
			items, hasNext, err = da.Home.SelectDiscussions(db, page, defaultPageSize)
		} else {
			items, hasNext, err = da.Home.SelectItems(db, page, defaultPageSize)
		}
		app.PanicIfErr(err)

		var feedListHTMLBuilder strings.Builder
		for _, item := range items {
			itemData, err := NewHomePageItemData(item)
			app.PanicIfErr(err)
			feedListHTMLBuilder.WriteString(vHomeItem.MustExecuteToString(itemData))
		}

		pageURLFormatter := &HomePageURLFormatter{Tab: tab}
		pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)
		pageBarHTML := rcom.GetPageBarHTML(pageData)

		userData := NewHomePageData(pageData, feedListHTMLBuilder.String(), pageBarHTML)
		d := app.MasterPageData("", vHomePage.MustExecuteToString(resp.Lang(), userData))
		d.Scripts = app.MasterPageManager.AssetsManager.JS.Home
		return resp.MustComplete(d)
	}

	// Forums mode.
	forumGroups, err := da.Home.SelectForumGroup(db)
	app.PanicIfErr(err)

	forums, err := da.Home.SelectForums(db)
	app.PanicIfErr(err)

	// Group forums by `group_id`.
	groupMap := make(map[uint64][]*da.HomeTableSelectForumsResult)
	for _, f := range forums {
		arr := groupMap[f.GroupID]
		if arr == nil {
			arr = make([]*da.HomeTableSelectForumsResult, 0)
		}
		groupMap[f.GroupID] = append(arr, f)
	}

	// Sort forums in each group.
	for _, v := range groupMap {
		sort.Slice(v, func(i, j int) bool {
			return v[i].OrderIndex < v[j].OrderIndex
		})
	}
}
