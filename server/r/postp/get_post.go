/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package postp

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

// GetPost is the HTTP handler for posts.
func GetPost(w http.ResponseWriter, r *http.Request) handler.HTML {
	pid, err := validator.DecodeID(chi.URLParam(r, "pid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	post, err := da.Post.SelectItemByID(appDB.Get().DB(), pid)
	app.PanicIfErr(err)

	resp := app.HTMLResponse(w, r)
	postModel := NewPostPageModel(&post)
	title := post.Title
	d := app.MainPageData(title, vPostPage.MustExecuteToString(postModel))
	d.Scripts = app.MainPageManager.AssetsManager.JS.Post
	d.WindData = PostPageWindData{EID: postModel.EID, CmtCount: postModel.CmtCount, InitialLikes: postModel.Likes}
	return resp.MustComplete(d)
}
