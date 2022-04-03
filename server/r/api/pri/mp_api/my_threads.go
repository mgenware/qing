/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
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

var myThreadsColumnNameToEnumMap map[string]int

func init() {
	myThreadsColumnNameToEnumMap = map[string]int{
		appdef.ColumnMessages: da.ThreadTableSelectItemsForPostCenterOrderBy1MsgCount,
		appdef.ColumnCreated:  da.ThreadTableSelectItemsForPostCenterOrderBy1CreatedAt,
	}
}

type pcThread struct {
	da.ThreadTableSelectItemsForPostCenterResult

	EID        string `json:"id"`
	URL        string `json:"url"`
	CreatedAt  string `json:"createdAt"`
	ModifiedAt string `json:"modifiedAt"`
}

func newPCThread(p *da.ThreadTableSelectItemsForPostCenterResult, uid uint64) pcThread {
	d := pcThread{ThreadTableSelectItemsForPostCenterResult: *p}
	d.URL = appURL.Get().Thread(p.ID)
	d.EID = clib.EncodeID(uid)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}

func myThreads(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := clib.GetPageParamFromDict(params)
	pageSize := clib.MustGetIntFromDict(params, appdef.KeyPageSize)
	sortBy := clib.MustGetStringFromDict(params, "sort", appdef.MaxGenericStringLen)
	desc := clib.MustGetIntFromDict(params, "desc") != 0

	rawThreads, hasNext, err := da.Thread.SelectItemsForPostCenter(appDB.DB(), uid, page, pageSize, myThreadsColumnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(appDB.DB(), uid)
	app.PanicIfErr(err)

	threads := make([]pcThread, len(rawThreads))
	for i, p := range rawThreads {
		threads[i] = newPCThread(&p, uid)
	}
	respData := apicom.NewPaginatedList(threads, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
