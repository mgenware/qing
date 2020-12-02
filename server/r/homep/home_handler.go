package homep

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcm"
	"strings"
)

const defaultPageSize = 10

func HomeHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	page := validator.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(defs.Constants.KeyTab)
	resp := app.HTMLResponse(w, r)

	var items []*da.HomeItemInterface
	var hasNext bool
	var err error

	db := app.DB
	if tab == defs.Constants.KeyPosts {
		items, hasNext, err = da.HomeTable.SelectPosts(db, page, defaultPageSize)
	} else if tab == defs.Constants.KeyDiscussions {
		items, hasNext, err = da.HomeTable.SelectDiscussions(db, page, defaultPageSize)
	} else {
		items, hasNext, err = da.HomeTable.SelectItems(db, page, defaultPageSize)
	}
	app.PanicIfErr(err)

	var feedListHTMLBuilder strings.Builder
	for _, item := range items {
		itemData, err := NewHomePageItemData(item)
		app.PanicIfErr(err)
		feedListHTMLBuilder.WriteString(vHomeItem.MustExecuteToString(itemData))
	}

	pageURLFormatter := &HomePageURLFormatter{Tab: tab}
	pageData := rcm.NewPageData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcm.GetPageBarHTML(pageData)

	userData := NewHomePageData(pageData, feedListHTMLBuilder.String(), pageBarHTML)
	d := app.MasterPageData("", vHomePage.MustExecuteToString(resp.Lang(), userData))
	d.Scripts = app.MasterPageManager.AssetsManager.JS.Home
	return resp.MustComplete(d)
}
