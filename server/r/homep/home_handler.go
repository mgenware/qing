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
	if conf.IsBREnv() {
		kHomePageSize = 2
	} else {
		kHomePageSize = 10
	}
}

// HomeHandler handles home page requests.
func HomeHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	if appConf.Get().FourmsEnabled() {
		return renderForumPage(w, r)
	}
	return renderStdPage(w, r)
}

func renderStdPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	db := appDB.DB()
	page := clib.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(appdef.KeyTab)
	cfg := appConf.Get()

	var items []da.HomePostItem
	var hasNext bool
	var err error
	if conf.IsBREnv() {
		var brPrefix string
		postPerm := cfg.Permissions.Post()
		if postPerm == appdef.PostPermissionOnlyMe {
			brPrefix = appdef.BrHomePrefixOnlyMe
		} else {
			// appdef.PostPermissionEveryone.
			brPrefix = appdef.BrHomePrefixEveryone
		}
		items, hasNext, err = da.Home.SelectPostsBR(db, brPrefix, page, kHomePageSize)
	} else {
		items, hasNext, err = da.Home.SelectPosts(db, page, kHomePageSize)
	}
	app.PanicOn(err)

	var feedListHTMLBuilder strings.Builder
	if len(items) == 0 {
		feedListHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
	} else {
		for _, item := range items {
			itemData := rcom.NewPostFeedData(&item)
			var feedItemHTML string

			switch cfg.Permissions.Post() {
			case appdef.PostPermissionOnlyMe:
				feedItemHTML = MustRenderOnlymeFeedView(&itemData)

			case appdef.PostPermissionEveryone:
				feedItemHTML = MustRenderUserFeedView(&itemData)
			}
			feedListHTMLBuilder.WriteString(feedItemHTML)
		}
	}

	pageURLFormatter := &HomePageURLFormatter{Tab: tab}
	paginationData := rcom.NewPaginationData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(resp.Lang(), paginationData)

	pageData := NewStdPageData(paginationData, feedListHTMLBuilder.String(), pageBarHTML)
	d := app.MainPageData("", vStdPage.MustExecuteToString(pageData))
	d.Header = appHandler.MainPage().AssetManager().MustGetStyle("homeStdEntry")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("homeStdEntry")
	return resp.MustComplete(&d)
}
