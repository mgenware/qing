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
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/da"
	"qing/lib/fmtx"
	"qing/r/sys"

	"github.com/go-chi/chi"
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
	d.WindData = PostPageWindData{EID: postModel.EID, CmtCount: postModel.CmtCount, InitialLikes: postModel.Likes, InitialHasLiked: hasLiked}
	return resp.MustComplete(d)
}
