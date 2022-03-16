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
	"qing/a/def"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

var myDiscussionsColumnNameToEnumMap map[string]int

func init() {
	myDiscussionsColumnNameToEnumMap = map[string]int{
		def.App.ColumnMessages: da.DiscussionTableSelectItemsForPostCenterOrderBy1ReplyCount,
		def.App.ColumnCreated:  da.DiscussionTableSelectItemsForPostCenterOrderBy1CreatedAt,
	}
}

type pcDiscussion struct {
	da.DiscussionTableSelectItemsForPostCenterResult

	EID        string `json:"id"`
	URL        string `json:"url"`
	CreatedAt  string `json:"createdAt"`
	ModifiedAt string `json:"modifiedAt"`
}

func newPCDiscussion(p *da.DiscussionTableSelectItemsForPostCenterResult, uid uint64) pcDiscussion {
	d := pcDiscussion{DiscussionTableSelectItemsForPostCenterResult: *p}
	d.URL = appURL.Get().Discussion(p.ID)
	d.EID = clib.EncodeID(uid)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}

func myDiscussions(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := clib.GetPageParamFromDict(params)
	pageSize := clib.MustGetIntFromDict(params, def.App.KeyPageSize)
	sortBy := clib.MustGetStringFromDict(params, "sort", def.App.MaxGenericStringLen)
	desc := clib.MustGetIntFromDict(params, "desc") != 0

	rawDiscussions, hasNext, err := da.Discussion.SelectItemsForPostCenter(appDB.DB(), uid, page, pageSize, myDiscussionsColumnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(appDB.DB(), uid)
	app.PanicIfErr(err)

	discussions := make([]pcDiscussion, len(rawDiscussions))
	for i, p := range rawDiscussions {
		discussions[i] = newPCDiscussion(&p, uid)
	}
	respData := apicom.NewPaginatedList(discussions, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
