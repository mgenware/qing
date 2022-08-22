/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mpapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

var myPostsColumnNameToEnumMap map[string]da.PostAGSelectItemsForPostCenterOrderBy1
var myThreadsColumnNameToEnumMap map[string]da.FPostAGSelectItemsForPostCenterOrderBy1

func init() {
	myPostsColumnNameToEnumMap = map[string]da.PostAGSelectItemsForPostCenterOrderBy1{
		appdef.KeyComments: da.PostAGSelectItemsForPostCenterOrderBy1CmtCount,
		appdef.KeyCreated:  da.PostAGSelectItemsForPostCenterOrderBy1CreatedAt,
		appdef.KeyLikes:    da.PostAGSelectItemsForPostCenterOrderBy1Likes,
	}
	myThreadsColumnNameToEnumMap = map[string]da.FPostAGSelectItemsForPostCenterOrderBy1{
		appdef.KeyComments: da.FPostAGSelectItemsForPostCenterOrderBy1CmtCount,
		appdef.KeyCreated:  da.FPostAGSelectItemsForPostCenterOrderBy1CreatedAt,
		appdef.KeyLikes:    da.FPostAGSelectItemsForPostCenterOrderBy1Likes,
	}
}

type pcPost struct {
	da.PostForPostCenter

	EID        string `json:"id"`
	URL        string `json:"url"`
	CreatedAt  string `json:"createdAt"`
	ModifiedAt string `json:"modifiedAt"`
}

func newPCPost(p *da.PostForPostCenter, uid uint64) pcPost {
	d := pcPost{PostForPostCenter: *p}
	d.URL = appURL.Get().Post(p.ID)
	d.EID = clib.EncodeID(uid)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}

func myPostsCore(w http.ResponseWriter, r *http.Request, isThread bool) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := clib.GetPageParamFromDict(params)
	pageSize := clib.MustGetIntFromDict(params, appdef.KeyPageSize)
	sortBy := clib.MustGetStringFromDict(params, "sort", appdef.LenMaxGenericString)
	desc := clib.MustGetIntFromDict(params, "desc") != 0

	db := appDB.DB()
	var rawPosts []da.PostForPostCenter
	var hasNext bool
	var err error
	if isThread {
		rawPosts, hasNext, err = da.FPost.SelectItemsForPostCenter(db, uid, page, pageSize, myThreadsColumnNameToEnumMap[sortBy], desc)
	} else {
		rawPosts, hasNext, err = da.Post.SelectItemsForPostCenter(db, uid, page, pageSize, myPostsColumnNameToEnumMap[sortBy], desc)
	}
	app.PanicOn(err)

	stats, err := da.UserStats.SelectStats(db, uid)
	app.PanicOn(err)

	posts := make([]pcPost, len(rawPosts))
	for i, p := range rawPosts {
		posts[i] = newPCPost(&p, uid)
	}
	respData := apicom.NewPaginatedList(posts, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}

func myPosts(w http.ResponseWriter, r *http.Request) handler.JSON {
	return myPostsCore(w, r, false)
}

func myThreads(w http.ResponseWriter, r *http.Request) handler.JSON {
	return myPostsCore(w, r, true)
}
