/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profilep

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/fmtx"
	"qing/lib/validator"
	"qing/r/rcom"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi"
)

const userPostsLimit = 10
const profileScript = "profileEntry"

// GetProfile handles user profile routes.
func GetProfile(w http.ResponseWriter, r *http.Request) handler.HTML {
	uid, err := fmtx.DecodeID(chi.URLParam(r, "uid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := validator.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(defs.Shared.KeyTab)
	resp := appHandler.HTMLResponse(w, r)

	db := appDB.DB()
	// User profile
	user, err := da.User.SelectProfile(db, uid)
	app.PanicIfErr(err)

	// User stats
	stats, err := da.UserStats.SelectStats(db, uid)
	app.PanicIfErr(err)

	pageTitle := user.Name

	var feedListHTML string
	var hasNext bool
	switch tab {
	default:
		{
			var posts []da.PostTableSelectItemsForUserProfileResult
			posts, hasNext, err = da.Post.SelectItemsForUserProfile(db, uid, page, userPostsLimit)
			app.PanicIfErr(err)
			var feedListHTMLBuilder strings.Builder
			for _, post := range posts {
				postData := NewProfilePostItem(&post)
				feedListHTMLBuilder.WriteString(vProfileFeedItem.MustExecuteToString(postData))
			}
			feedListHTML = feedListHTMLBuilder.String()
			break
		}

	case defs.Shared.KeyDiscussions:
		{
			var discussions []da.DiscussionTableSelectItemsForUserProfileResult
			discussions, hasNext, err = da.Discussion.SelectItemsForUserProfile(db, uid, page, userPostsLimit)
			app.PanicIfErr(err)
			var feedListHTMLBuilder strings.Builder
			for _, discussion := range discussions {
				discussionData := NewProfileDiscussionItem(&discussion)
				feedListHTMLBuilder.WriteString(vProfileFeedItem.MustExecuteToString(discussionData))
			}
			feedListHTML = feedListHTMLBuilder.String()
			break
		}
	}

	pageURLFormatter := NewProfilePageURLFormatter(uid, tab)
	pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)

	if feedListHTML == "" {
		feedListHTML = rcom.MustRunNoContentViewTemplate()
	}
	profileModel := NewProfilePageModelFromUser(&user, &stats, feedListHTML, rcom.GetPageBarHTML(pageData))
	d := appHandler.MainPageData(pageTitle, vProfilePage.MustExecuteToString(profileModel))
	d.Scripts = appHandler.MainPage().ScriptString(profileScript)
	d.WindData = ProfilePageWindData{Website: user.Website}
	return resp.MustComplete(d)
}
