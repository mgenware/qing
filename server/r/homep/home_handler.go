/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package homep

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appSettings"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
	"strings"
)

const defaultPageSize = 10
const homeStdEntry = "home/homeStdEntry"
const homeFrmScript = "home/homeFrmEntry"

// HomeHandler handles home page requests.
func HomeHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	// Non-forums mode.
	if !appSettings.Get().Forums() {
		return renderStdPage(w, r)
	}
	return renderForumPage(w, r)
}

func renderStdPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	db := appDB.DB()
	page := clib.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(appdef.KeyTab)

	items, hasNext, err := da.Home.SelectPosts(db, page, defaultPageSize)
	app.PanicOn(err)

	var feedListHTMLBuilder strings.Builder
	if len(items) == 0 {
		feedListHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
	} else {
		for _, item := range items {
			itemModel := rcom.NewPostFeedModel(&item)
			feedListHTMLBuilder.WriteString(rcom.MustRenderPostFeedView(&itemModel))
		}
	}

	pageURLFormatter := &HomePageURLFormatter{Tab: tab}
	pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	pageModel := NewStdPageModel(pageData, feedListHTMLBuilder.String(), pageBarHTML)
	d := app.MainPageData("", vStdPage.MustExecuteToString(pageModel))
	d.Header = appHandler.MainPage().AssetManager().Style(homeStdEntry)
	d.Scripts = appHandler.MainPage().AssetManager().Script(homeStdEntry)
	return resp.MustComplete(&d)
}
