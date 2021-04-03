/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mpapi

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apicom"
)

var myPostsColumnNameToEnumMap map[string]int

func init() {
	myPostsColumnNameToEnumMap = map[string]int{
		defs.Shared.ColumnComments: da.PostTableSelectItemsForPostCenterOrderBy1CmtCount,
		defs.Shared.ColumnCreated:  da.PostTableSelectItemsForPostCenterOrderBy1CreatedAt,
		defs.Shared.ColumnLikes:    da.PostTableSelectItemsForPostCenterOrderBy1Likes,
	}
}

type pcPost struct {
	da.PostTableSelectItemsForPostCenterResult

	EID string `json:"id"`
	URL string `json:"url"`
}

func newPCPost(p *da.PostTableSelectItemsForPostCenterResult, uid uint64) pcPost {
	d := pcPost{PostTableSelectItemsForPostCenterResult: *p}
	d.URL = app.URL.Post(p.ID)
	d.EID = validator.EncodeID(uid)
	return d
}

func myPosts(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := validator.GetPageParamFromDict(params)
	pageSize := validator.MustGetIntFromDict(params, defs.Shared.KeyPageSize)
	sortBy := validator.MustGetStringFromDict(params, "sort", defs.Shared.MaxGenericStringLen)
	desc := validator.MustGetIntFromDict(params, "desc") != 0

	rawPosts, hasNext, err := da.Post.SelectItemsForPostCenter(appDB.Get().DB(), uid, page, pageSize, myPostsColumnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(appDB.Get().DB(), uid)
	app.PanicIfErr(err)

	posts := make([]pcPost, len(rawPosts))
	for i, p := range rawPosts {
		posts[i] = newPCPost(&p, uid)
	}
	respData := apicom.NewPaginatedList(posts, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
