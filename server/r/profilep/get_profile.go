/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profilep

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi/v5"
)

const userPostsLimit = 10

// GetProfile handles user profile routes.
func GetProfile(w http.ResponseWriter, r *http.Request) handler.HTML {
	uid, err := clib.DecodeID(chi.URLParam(r, "uid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := clib.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(appDef.KeyTab)
	resp := app.HTMLResponse(w, r)

	db := appDB.DB()
	// User profile
	user, err := da.User.SelectProfile(db, uid)
	app.PanicOn(err)

	// User stats
	stats, err := da.UserStats.SelectStats(db, uid)
	app.PanicOn(err)

	pageTitle := user.Name

	var feedListHTML string
	var hasNext bool

	var posts []da.PostItemForProfile
	if tab == appDef.KeyForumPosts {
		posts, hasNext, err = da.FPost.SelectItemsForUserProfile(db, uid, page, userPostsLimit)
	} else {
		posts, hasNext, err = da.Post.SelectItemsForUserProfile(db, uid, page, userPostsLimit)
	}
	app.PanicOn(err)
	var feedListHTMLBuilder strings.Builder
	for _, post := range posts {
		postData := NewProfilePostItemData(&post)
		feedListHTMLBuilder.WriteString(vProfileFeedItem.MustExecuteToString(postData))
	}
	feedListHTML = feedListHTMLBuilder.String()

	pageURLFormatter := NewProfilePageURLFormatter(uid, tab)
	paginationData := rcom.NewPaginationData(page, hasNext, pageURLFormatter, 0)

	if feedListHTML == "" {
		feedListHTML = rcom.MustRunNoContentViewTemplate()
	}
	profileData := NewProfilePageDataFromUser(&user, &stats, feedListHTML, rcom.GetPageBarHTML(resp.Lang(), paginationData))
	d := app.MainPageData(pageTitle, vProfilePage.MustExecuteToString(profileData))
	d.Header = appHandler.MainPage().AssetManager().MustGetStyle("profileEntry")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("profileEntry")
	d.Extra = ProfilePageWindData{Website: user.Website}
	return resp.MustComplete(&d)
}
