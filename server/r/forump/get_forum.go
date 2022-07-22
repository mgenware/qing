/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi/v5"
)

const defaultPageSize = 10
const forumScript = "forum/forumEntry"

func getForum(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	db := appDB.DB()
	var err error

	fid, err := clib.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := clib.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(appdef.KeyTab)

	forum, err := da.Forum.SelectForum(db, fid)
	app.PanicIfErr(err)

	items, hasNext, err := da.Forum.SelectThreads(db, &fid, page, defaultPageSize)
	app.PanicIfErr(err)

	var feedListHTMLBuilder strings.Builder
	if len(items) == 0 {
		feedListHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
	} else {
		for _, item := range items {
			itemModel := rcom.NewThreadFeedModel(&item)
			feedListHTMLBuilder.WriteString(rcom.MustRenderThreadFeedView(&itemModel))
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
	return resp.MustComplete(&d)
}
