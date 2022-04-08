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
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

var myPostsColumnNameToEnumMap map[string]int

func init() {
	myPostsColumnNameToEnumMap = map[string]int{
		appdef.KeyComments: da.PostTableSelectItemsForPostCenterOrderBy1CmtCount,
		appdef.KeyCreated:  da.PostTableSelectItemsForPostCenterOrderBy1CreatedAt,
		appdef.KeyLikes:    da.PostTableSelectItemsForPostCenterOrderBy1Likes,
	}
}

type pcPost struct {
	da.PostTableSelectItemsForPostCenterResult

	EID        string `json:"id"`
	URL        string `json:"url"`
	CreatedAt  string `json:"createdAt"`
	ModifiedAt string `json:"modifiedAt"`
}

func newPCPost(p *da.PostTableSelectItemsForPostCenterResult, uid uint64) pcPost {
	d := pcPost{PostTableSelectItemsForPostCenterResult: *p}
	d.URL = appURL.Get().Post(p.ID)
	d.EID = clib.EncodeID(uid)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}

func myPosts(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := clib.GetPageParamFromDict(params)
	pageSize := clib.MustGetIntFromDict(params, appdef.KeyPageSize)
	sortBy := clib.MustGetStringFromDict(params, "sort", appdef.LenMaxGenericString)
	desc := clib.MustGetIntFromDict(params, "desc") != 0

	rawPosts, hasNext, err := da.Post.SelectItemsForPostCenter(appDB.DB(), uid, page, pageSize, myPostsColumnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(appDB.DB(), uid)
	app.PanicIfErr(err)

	posts := make([]pcPost, len(rawPosts))
	for i, p := range rawPosts {
		posts[i] = newPCPost(&p, uid)
	}
	respData := apicom.NewPaginatedList(posts, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
