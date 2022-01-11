/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package postp

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/app"
	"qing/da"
	"qing/lib/fmtx"
	"qing/r/sys"
	"qing/sod/post/postWind"

	"github.com/go-chi/chi/v5"
)

const postScript = "post/postEntry"

// GetPost is the HTTP handler for posts.
func GetPost(w http.ResponseWriter, r *http.Request) handler.HTML {
	pid, err := fmtx.DecodeID(chi.URLParam(r, "pid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	db := appDB.DB()
	post, err := da.Post.SelectItemByID(db, pid)
	app.PanicIfErr(err)

	resp := appHandler.HTMLResponse(w, r)
	uid := resp.UserID()

	hasLiked := false
	if uid != 0 {
		liked, err := da.PostLike.HasLiked(db, pid, uid)
		app.PanicIfErr(err)
		hasLiked = liked
	}

	postModel := NewPostPageModel(&post)
	title := post.Title
	d := appHandler.MainPageData(title, vPostPage.MustExecuteToString(postModel))
	d.Scripts = appHandler.MainPage().ScriptString(postScript)
	d.WindData = postWind.NewPostWind(postModel.EID, postModel.CmtCount, postModel.Likes, hasLiked)
	return resp.MustComplete(d)
}
