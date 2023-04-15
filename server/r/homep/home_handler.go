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
	"qing/a/appConf"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/conf"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
	"strings"
)

var kHomePageSize int

func init() {
	cc := appConf.Get()
	if cc.ProductionMode() {
		kHomePageSize = 10
	} else {
		kHomePageSize = 2
	}
}

// HomeHandler handles home page requests.
func HomeHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	if appConf.Get().Site.ForumSite() {
		return renderForumPage(w, r)
	}
	return renderStdPage(w, r)
}

func renderStdPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	db := appDB.DB()
	page := clib.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(appdef.KeyTab)

	var items []da.HomePostItem
	var hasNext bool
	var err error
	if conf.IsBREnv() {
		items, hasNext, err = da.Home.SelectPostsBR(db, page, kHomePageSize)
	} else {
		items, hasNext, err = da.Home.SelectPosts(db, page, kHomePageSize)
	}
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
	pageBarHTML := rcom.GetPageBarHTML(resp.Lang(), pageData)

	pageModel := NewStdPageModel(pageData, feedListHTMLBuilder.String(), pageBarHTML)
	d := app.MainPageData("", vStdPage.MustExecuteToString(pageModel))
	d.Header = appHandler.MainPage().AssetManager().MustGetStyle("homeStd")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("home", "homeStdEntry")
	return resp.MustComplete(&d)
}
