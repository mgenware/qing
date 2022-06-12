/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package postp

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/sys"
	postSod "qing/sod/post"

	"github.com/go-chi/chi/v5"
)

const postScript = "post/postEntry"

// Called by both post and thread handlers.
func GetPostCore(w http.ResponseWriter, r *http.Request, isThread bool) handler.HTML {
	id, err := clib.DecodeID(chi.URLParam(r, "id"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	db := appDB.DB()

	var post da.PostItem
	if isThread {
		post, err = da.Post.SelectItemByID(db, id)
	} else {
		post, err = da.FPost.SelectItemByID(db, id)
	}
	app.PanicIfErr(err)

	resp := appHandler.HTMLResponse(w, r)
	uid := resp.UserID()

	hasLiked := false
	if uid != 0 {
		liked, err := da.PostLike.HasLiked(db, id, uid)
		app.PanicIfErr(err)
		hasLiked = liked
	}

	postModel := NewPostPageModel(&post)
	title := post.Title
	d := appHandler.MainPageData(title, vPostPage.MustExecuteToString(postModel))
	d.Scripts = appHandler.MainPage().ScriptString(postScript)
	d.WindData = postSod.NewPostWind(postModel.EID, postModel.CmtCount, postModel.Likes, hasLiked, &postModel.ForumID)
	return resp.MustComplete(d)
}

func GetPost(w http.ResponseWriter, r *http.Request) handler.HTML {
	return GetPostCore(w, r, false)
}
