/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi"
)

const defaultPageSize = 10

func getForum(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	db := app.DB
	var err error

	fid, err := validator.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := validator.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(defs.Shared.KeyTab)

	forum, err := da.Forum.SelectForum(db, fid)
	app.PanicIfErr(err)

	var items []da.UserThreadInterface
	var hasNext bool

	if tab == defs.Shared.KeyDiscussions {
		items, hasNext, err = da.Forum.SelectDiscussions(db, page, defaultPageSize)
	} else if tab == defs.Shared.KeyQuestions {
		items, hasNext, err = da.Forum.SelectQuestions(db, page, defaultPageSize)
	} else {
		items, hasNext, err = da.Forum.SelectThreads(db, page, defaultPageSize)
	}
	app.PanicIfErr(err)

	var feedListHTMLBuilder strings.Builder
	for _, item := range items {
		itemModel, err := rcom.NewUserThreadModel(&item)
		app.PanicIfErr(err)
		feedListHTMLBuilder.WriteString(rcom.MustRunUserThreadViewTemplate(&itemModel))
	}

	pageURLFormatter := NewForumPageURLFormatter(forum.ID, tab)
	pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	forumEditable, err := getForumEditableFromContext(r.Context(), fid)
	app.PanicIfErr(err)
	forumModel := NewForumPageModel(&forum, feedListHTMLBuilder.String(), pageBarHTML, forumEditable)
	d := app.MainPageData("", vForumPage.MustExecuteToString(forumModel))
	d.Scripts = app.MainPageManager.AssetsManager.JS.Forum
	d.WindData = ForumPageWindData{Editable: forumModel.ForumEditable, FID: forumModel.ForumEID}
	return resp.MustComplete(d)
}
