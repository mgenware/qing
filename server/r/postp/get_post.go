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
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
	"qing/r/sys"
	"qing/sod/postSod"

	"github.com/go-chi/chi/v5"
)

// Called by both post and thread handlers.
func GetPostCore(w http.ResponseWriter, r *http.Request, isThread bool) handler.HTML {
	id, err := clib.DecodeID(chi.URLParam(r, "id"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	db := appDB.DB()

	focusedCmtIDStr := r.FormValue("cmt")
	focusedCmtID, err := clib.DecodeID(focusedCmtIDStr)
	app.PanicOn(err)

	var postType frozenDef.ContentBaseType
	var post da.PostItem
	if isThread {
		postType = frozenDef.ContentBaseTypeFPost
		post, err = da.FPost.SelectItemByID(db, id)
	} else {
		postType = frozenDef.ContentBaseTypePost
		post, err = da.Post.SelectItemByID(db, id)
	}
	app.PanicOn(err)

	resp := app.HTMLResponse(w, r)
	uid := resp.UserID()

	hasLiked := false
	if uid != 0 {
		liked, err := da.PostLike.HasLiked(db, id, uid)
		app.PanicOn(err)
		hasLiked = liked
	}

	postData := NewPostPageData(&post)
	var fid *string
	if post.ForumID != nil {
		str := clib.EncodeID(*post.ForumID)
		fid = &str
	}
	d := app.MainPageData(post.Title, vPostPage.MustExecuteToString(postData))
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("postEntry")

	cmtFocusModeData := rcom.GetCmtFocusModeData(focusedCmtID, id, postType)
	d.Extra = postSod.NewPostWind(postData.EID, postData.CmtCount, postData.Likes, hasLiked, isThread, fid, cmtFocusModeData)
	return resp.MustComplete(&d)
}

func GetPost(w http.ResponseWriter, r *http.Request) handler.HTML {
	return GetPostCore(w, r, false)
}
