/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profilep

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
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

func ProfilePage(w http.ResponseWriter, r *http.Request) handler.HTML {
	uid, err := clib.DecodeID(chi.URLParam(r, "uid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := clib.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(appDef.KeyTab)
	resp := appHandler.HTMLResponse(w, r)

	db := appDB.DB()
	// User profile
	user, err := da.User.SelectProfile(db, uid)
	appcm.PanicOn(err, "failed to select user profile")

	// User stats
	stats, err := da.UserStats.SelectStats(db, uid)
	appcm.PanicOn(err, "failed to select user stats")

	pageTitle := user.Name

	var feedListHTML string
	var hasNext bool

	var posts []da.DBPostForProfile
	if tab == appDef.KeyForumPosts {
		posts, hasNext, err = da.FPost.SelectItemsForUserProfile(db, uid, page, userPostsLimit)
	} else {
		posts, hasNext, err = da.Post.SelectItemsForUserProfile(db, uid, page, userPostsLimit)
	}
	appcm.PanicOn(err, "failed to select user posts")
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
	d := appHandler.MainPageData(pageTitle, vProfilePage.MustExecuteToString(profileData))
	d.Header = appHandler.MainPage().AssetManager().MustGetStyle("profileEntry")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("profileEntry")
	d.ExtraState = ProfilePageWindData{Website: user.Website}
	return resp.MustComplete(&d)
}
