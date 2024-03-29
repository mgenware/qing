/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package homep

import (
	"net/http"
	"qing/a/appConfig"
	"qing/a/appDB"
	"qing/a/appEnv"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/lib/httplib"
	"qing/r/rcom"
	"strings"
)

var kHomePageSize int

func init() {
	if appEnv.IsBR() {
		kHomePageSize = 2
	} else {
		kHomePageSize = 10
	}
}

func HomePage(w http.ResponseWriter, r *http.Request) handler.HTML {
	ac := appConfig.Get(r)
	if ac.ForumEnabled() {
		return renderForumPage(w, r)
	}
	return renderStdPage(w, r)
}

func renderStdPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	db := appDB.DB()
	page := clib.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(appDef.KeyTab)
	appCfg := appConfig.Get(r)

	var items []da.DBHomePost
	var hasNext bool
	var err error
	if appEnv.IsBR() {
		brPrefix, err := httplib.ReadCookie(r, appDef.BrHomePostCookiePrefix)
		appcm.PanicOn(err, "failed to read cookie(BrHomePostCookiePrefix)")
		if brPrefix == "" {
			// If the cookie is not set, no filtering is done (which is LIKE % in SQL).
			brPrefix = "%"
		} else if !strings.HasSuffix(brPrefix, "%") {
			brPrefix += "%"
		}
		items, hasNext, err = da.Home.SelectPostsBR(db, brPrefix, page, kHomePageSize)
		appcm.PanicOn(err, "failed to select home posts")
	} else {
		items, hasNext, err = da.Home.SelectPosts(db, page, kHomePageSize)
		appcm.PanicOn(err, "failed to select home posts")
	}

	var feedListHTMLBuilder strings.Builder
	if len(items) == 0 {
		feedListHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
	} else {
		for _, item := range items {
			itemData := rcom.NewPostFeedData(&item)
			var feedItemHTML string

			switch appCfg.PostPermission() {
			case frozenDef.PostPermissionConfigOnlyMe:
				feedItemHTML = MustRenderOnlyMeFeedView(&itemData)

			case frozenDef.PostPermissionConfigEveryone:
				feedItemHTML = MustRenderUserFeedView(&itemData)
			}
			feedListHTMLBuilder.WriteString(feedItemHTML)
		}
	}

	pageURLFormatter := &HomePageURLFormatter{Tab: tab}
	paginationData := rcom.NewPaginationData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(resp.Lang(), paginationData)

	pageData := NewStdPageData(paginationData, feedListHTMLBuilder.String(), pageBarHTML)
	d := appHandler.MainPageData("", vStdPage.MustExecuteToString(pageData))
	d.Header = appHandler.MainPage().AssetManager().MustGetStyle("homeStdEntry")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("homeStdEntry")
	return resp.MustComplete(&d)
}
