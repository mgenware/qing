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

const defaultPageSize = 10
const forumScript = "forum/forumEntry"

func getForum(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	db := appDB.DB()
	var err error

	fid, err := fmtx.DecodeID(chi.URLParam(r, "fid"))
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
	if len(items) == 0 {
		feedListHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
	} else {
		for _, item := range items {
			itemModel, err := rcom.NewUserThreadModel(&item)
			app.PanicIfErr(err)
			feedListHTMLBuilder.WriteString(rcom.MustRunUserThreadViewTemplate(&itemModel))
		}
	}

	pageURLFormatter := NewForumPageURLFormatter(forum.ID, tab)
	pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	forumEditable, err := getForumEditableFromContext(r.Context(), fid)
	app.PanicIfErr(err)
	forumModel := NewForumPageModel(&forum, feedListHTMLBuilder.String(), pageBarHTML, forumEditable)
	d := appHandler.MainPageData("", vForumPage.MustExecuteToString(forumModel))
	d.Scripts = appHandler.MainPage().ScriptString(forumScript)
	d.WindData = ForumPageWindData{Editable: forumModel.ForumEditable, FID: forumModel.ForumEID}
	return resp.MustComplete(d)
}
