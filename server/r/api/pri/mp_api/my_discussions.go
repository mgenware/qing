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
	"qing/a/defs"
	"qing/a/handler"
	"qing/app"
	"qing/da"
	"qing/lib/fmtx"
	"qing/lib/validator"
	"qing/r/api/apicom"
)

var myDiscussionsColumnNameToEnumMap map[string]int

func init() {
	myDiscussionsColumnNameToEnumMap = map[string]int{
		defs.Shared.ColumnMessages: da.DiscussionTableSelectItemsForPostCenterOrderBy1ReplyCount,
		defs.Shared.ColumnCreated:  da.DiscussionTableSelectItemsForPostCenterOrderBy1CreatedAt,
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
	d.EID = fmtx.EncodeID(uid)
	d.CreatedAt = fmtx.Time(d.RawCreatedAt)
	d.ModifiedAt = fmtx.Time(d.RawModifiedAt)
	return d
}

func myDiscussions(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := validator.GetPageParamFromDict(params)
	pageSize := validator.MustGetIntFromDict(params, defs.Shared.KeyPageSize)
	sortBy := validator.MustGetStringFromDict(params, "sort", defs.Shared.MaxGenericStringLen)
	desc := validator.MustGetIntFromDict(params, "desc") != 0

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
