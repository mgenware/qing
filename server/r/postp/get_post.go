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
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
	"qing/r/sys"
	"qing/sod/cmtSod"
	"qing/sod/postSod"

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

	focusedCmtIDStr := r.FormValue("cmt")
	focusedCmtID, err := clib.DecodeID(focusedCmtIDStr)
	app.PanicOn(err)

	var post da.PostItem
	if isThread {
		post, err = da.FPost.SelectItemByID(db, id)
	} else {
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

	postModel := NewPostPageModel(&post)
	var fid *string
	if post.ForumID != nil {
		str := clib.EncodeID(*post.ForumID)
		fid = &str
	}
	d := app.MainPageData(post.Title, vPostPage.MustExecuteToString(postModel))
	d.Scripts = appHandler.MainPage().AssetManager().Script(postScript)

	var focusedCmt *cmtSod.Cmt
	var focusedCmtParent *cmtSod.Cmt
	var focusedCmt404 bool
	if focusedCmtID > 0 {
		focusedCmtDB, err := da.Cmt.SelectCmt(db, focusedCmtID)
		app.PanicOn(err)
		focusedCmtVal := apicom.NewCmt(&focusedCmtDB)
		focusedCmt = &focusedCmtVal

		postType := appdef.ContentBaseTypePost
		if isThread {
			postType = appdef.ContentBaseTypeThread
		}

		// Check focused cmt belongs to current post.
		if focusedCmt.HostID != id || focusedCmt.HostType != uint8(postType) {
			focusedCmt404 = true
			focusedCmt = nil
		} else {
			// Fetch parent cmt if needed.
			if focusedCmt.ParentID != nil {
				parentID, err := clib.DecodeID(*focusedCmt.ParentID)
				app.PanicOn(err)

				focusedCmtParentDB, err := da.Cmt.SelectCmt(db, parentID)
				app.PanicOn(err)
				focusedCmtParentVal := apicom.NewCmt(&focusedCmtParentDB)
				focusedCmtParent = &focusedCmtParentVal
			}
		}
	}

	d.WindData = postSod.NewPostWind(postModel.EID, postModel.CmtCount, postModel.Likes, hasLiked, isThread, fid, focusedCmt404, focusedCmt, focusedCmtParent)
	return resp.MustComplete(&d)
}

func GetPost(w http.ResponseWriter, r *http.Request) handler.HTML {
	return GetPostCore(w, r, false)
}
