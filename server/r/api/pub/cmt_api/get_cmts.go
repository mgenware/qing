/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package cmtapi

import (
	"fmt"
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/defs"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
	"qing/sod/cmt/cmt"

	"github.com/mgenware/mingru-go-lib"
)

var kCmtPageSize int

func init() {
	cc := app.CoreConfig()
	if cc.ProductionMode() {
		kCmtPageSize = 10
	} else {
		kCmtPageSize = 2
	}
}

type GetCmtsRespData struct {
	Items   []cmt.Cmt `json:"items"`
	HasNext bool      `json:"hasNext"`
}

func newGetCmtsRespData(cmts []da.CmtData, hasNext bool) GetCmtsRespData {
	cmtsConverted := make([]cmt.Cmt, len(cmts))
	for i := 0; i < len(cmts); i++ {
		cmtsConverted[i] = apicom.NewCmt(&cmts[i])
	}
	res := GetCmtsRespData{}
	res.Items = cmtsConverted
	res.HasNext = hasNext
	return res
}

func getCmts(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	parentID := clib.GetIDFromDict(params, "parentID")
	page := clib.GetPageParamFromDict(params)

	db := appDB.DB()
	var respData GetCmtsRespData
	var items []da.CmtData
	var hasNext bool
	var err error

	// Selecting replies.
	if parentID != 0 {
		if uid == 0 {
			items, hasNext, err = da.Cmt.SelectReplies(db, &parentID, page, kCmtPageSize)
		} else {
			items, hasNext, err = da.Cmt.SelectRepliesWithLike(db, uid, &parentID, page, kCmtPageSize)
		}
		if err != nil {
			app.PanicIfErr(err)
		}

		respData := newGetCmtsRespData(items, hasNext)
		return resp.MustComplete(respData)
	}

	// Selecting comments.
	host := clib.MustGetEntityInfoFromDict(params, "host")
	var cmtRelTable mingru.Table

	switch host.Type {
	case defs.Shared.EntityPost:
		{
			cmtRelTable = da.PostCmt
		}
	default:
		{
			panic(fmt.Errorf("unsupported entity type %v", host.Type))
		}
	}

	if uid == 0 {
		items, hasNext, err = da.ContentBaseCmtUtil.SelectRootCmts(db, cmtRelTable, host.ID, page, kCmtPageSize)
	} else {
		items, hasNext, err = da.ContentBaseCmtUtil.SelectRootCmtsWithLikes(db, cmtRelTable, uid, host.ID, page, kCmtPageSize)
	}
	if err != nil {
		app.PanicIfErr(err)
	}
	respData = newGetCmtsRespData(items, hasNext)

	return resp.MustComplete(respData)
}
