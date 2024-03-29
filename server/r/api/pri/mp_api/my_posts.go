/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mpapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

var myPostsColumnNameToEnumMap map[string]da.PostAGSelectItemsForPostCenterOrderBy1
var myFPostsColumnNameToEnumMap map[string]da.FPostAGSelectItemsForPostCenterOrderBy1

func init() {
	myPostsColumnNameToEnumMap = map[string]da.PostAGSelectItemsForPostCenterOrderBy1{
		appDef.KeyComments: da.PostAGSelectItemsForPostCenterOrderBy1CmtCount,
		appDef.KeyCreated:  da.PostAGSelectItemsForPostCenterOrderBy1CreatedAt,
		appDef.KeyLikes:    da.PostAGSelectItemsForPostCenterOrderBy1Likes,
	}
	myFPostsColumnNameToEnumMap = map[string]da.FPostAGSelectItemsForPostCenterOrderBy1{
		appDef.KeyComments: da.FPostAGSelectItemsForPostCenterOrderBy1CmtCount,
		appDef.KeyCreated:  da.FPostAGSelectItemsForPostCenterOrderBy1CreatedAt,
		appDef.KeyLikes:    da.FPostAGSelectItemsForPostCenterOrderBy1Likes,
	}
}

type pcPost struct {
	da.DBPostForPostCenter

	EID        string `json:"id"`
	URL        string `json:"url"`
	CreatedAt  string `json:"createdAt"`
	ModifiedAt string `json:"modifiedAt"`
}

func newPCPost(p *da.DBPostForPostCenter, uid uint64) pcPost {
	d := pcPost{DBPostForPostCenter: *p}
	d.URL = appURL.Get().Post(p.ID)
	d.EID = clib.EncodeID(uid)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}

func myPostsCore(w http.ResponseWriter, r *http.Request, fpost bool) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()

	page := clib.GetPageParamFromDict(params)
	pageSize := clib.MustGetIntFromDict(params, appDef.KeyPageSize)
	sortBy := clib.MustGetStringFromDict(params, "sort", appDef.LenMaxGenericString)
	desc := clib.MustGetIntFromDict(params, "desc") != 0

	db := appDB.DB()
	var rawPosts []da.DBPostForPostCenter
	var hasNext bool
	var err error
	if fpost {
		rawPosts, hasNext, err = da.FPost.SelectItemsForPostCenter(db, uid, page, pageSize, myFPostsColumnNameToEnumMap[sortBy], desc)
	} else {
		rawPosts, hasNext, err = da.Post.SelectItemsForPostCenter(db, uid, page, pageSize, myPostsColumnNameToEnumMap[sortBy], desc)
	}
	appcm.PanicOn(err, "failed to select posts")

	stats, err := da.UserStats.SelectStats(db, uid)
	appcm.PanicOn(err, "failed to select user stats")

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

func myFPosts(w http.ResponseWriter, r *http.Request) handler.JSON {
	return myPostsCore(w, r, true)
}
