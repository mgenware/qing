/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

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

const defaultPageSize = 10

func getForum(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	db := appDB.DB()
	var err error

	fid, err := clib.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := clib.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(appDef.KeyTab)

	forum, err := da.Forum.SelectForum(db, fid)
	appcm.PanicOn(err)

	items, hasNext, err := da.Forum.SelectFPosts(db, &fid, page, defaultPageSize)
	appcm.PanicOn(err)

	var feedListHTMLBuilder strings.Builder
	if len(items) == 0 {
		feedListHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
	} else {
		for _, item := range items {
			itemData := rcom.NewThreadFeedData(&item)
			feedListHTMLBuilder.WriteString(rcom.MustRenderThreadFeedView(&itemData))
		}
	}

	pageURLFormatter := NewForumPageURLFormatter(forum.ID, tab)
	paginationData := rcom.NewPaginationData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(resp.Lang(), paginationData)

	forumEditable, err := getForumEditableFromContext(r.Context(), fid)
	appcm.PanicOn(err)
	forumData := NewForumPageData(&forum, feedListHTMLBuilder.String(), pageBarHTML, forumEditable)
	d := appHandler.MainPageData("", vForumPage.MustExecuteToString(forumData))
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("forumEntry")
	d.ExtraState = ForumPageWindData{Editable: forumData.ForumEditable, FID: forumData.ForumEID}
	return resp.MustComplete(&d)
}
