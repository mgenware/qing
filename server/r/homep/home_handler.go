/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package homep

import (
	"net/http"
	"qing/app"
	"qing/app/appConfig"
	"qing/app/appDB"
	"qing/app/appHandler"
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
	resp := appHandler.HTMLResponse(w, r)
	db := appDB.Get().DB()

	// Non-forums mode.
	if !appConfig.SetupConfig().ForumsMode {
		page := validator.GetPageParamFromRequestQueryString(r)
		tab := r.FormValue(defs.Shared.KeyTab)

		var items []da.UserThreadInterface
		var hasNext bool
		var err error

		if tab == defs.Shared.KeyPosts {
			items, hasNext, err = da.Home.SelectPosts(db, page, defaultPageSize)
		} else if tab == defs.Shared.KeyDiscussions {
			items, hasNext, err = da.Home.SelectDiscussions(db, page, defaultPageSize)
		} else if tab == defs.Shared.KeyQuestions {
			items, hasNext, err = da.Home.SelectQuestions(db, page, defaultPageSize)
		} else {
			items, hasNext, err = da.Home.SelectItems(db, page, defaultPageSize)
		}
		app.PanicIfErr(err)

		var feedListHTMLBuilder strings.Builder
		for _, item := range items {
			itemModel, err := rcom.NewUserThreadModel(&item)
			app.PanicIfErr(err)
			feedListHTMLBuilder.WriteString(rcom.MustRunUserThreadViewTemplate(&itemModel))
		}

		pageURLFormatter := &HomePageURLFormatter{Tab: tab}
		pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)
		pageBarHTML := rcom.GetPageBarHTML(pageData)

		pageModel := NewStdPageModel(pageData, feedListHTMLBuilder.String(), pageBarHTML)
		d := appHandler.MainPageData("", vStdPage.MustExecuteToString(pageModel))
		d.Scripts = appHandler.MainPage().AssetManager().JS.HomeStd
		return resp.MustComplete(d)
	}

	// Forums mode.
	forumGroups, err := da.Home.SelectForumGroups(db)
	app.PanicIfErr(err)

	var mainHTML string
	if len(forumGroups) == 0 {
		mainHTML = rcom.MustRunNoContentViewTemplate()
	} else {
		forums, err := da.Home.SelectForums(db)
		app.PanicIfErr(err)

		// Group forums by `group_id`.
		groupMap := make(map[uint64][]da.HomeTableSelectForumsResult)
		for _, f := range forums {
			if f.GroupID == nil {
				continue
			}
			gid := *f.GroupID
			arr := groupMap[gid]
			if arr == nil {
				arr = make([]da.HomeTableSelectForumsResult, 0)
			}
			groupMap[gid] = append(arr, f)
		}

		// Sort forums in each group.
		for _, v := range groupMap {
			sort.Slice(v, func(i, j int) bool {
				return v[i].OrderIndex < v[j].OrderIndex
			})
		}

		var frmHTMLBuilder strings.Builder
		// Iterate through forums.
		for _, group := range forumGroups {
			forums := groupMap[group.ID]
			if len(forums) == 0 {
				frmHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
			} else {
				var forumsHTMLBuilder strings.Builder
				for _, forum := range forums {
					forumModel := NewForumModel(&forum)
					forumsHTMLBuilder.WriteString(vForumView.MustExecuteToString(forumModel))
				}

				groupModel := NewForumGroupModel(&group, forumsHTMLBuilder.String())
				frmHTMLBuilder.WriteString(vForumGroupView.MustExecuteToString(groupModel))
			}
		}

		frmPageModel := NewFrmPageModel(frmHTMLBuilder.String())
		mainHTML = vFrmPage.MustExecuteToString(frmPageModel)
	}

	d := appHandler.MainPageData("", mainHTML)
	d.Scripts = appHandler.MainPage().AssetManager().JS.HomeFrm
	return resp.MustComplete(d)
}
