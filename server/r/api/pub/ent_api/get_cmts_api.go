/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package entapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/coreConfig"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
	"qing/sod/cmtSod"

	"github.com/mgenware/goutil/jsonx"
)

var kCmtPageSize int

func init() {
	cc := coreConfig.Get()
	if cc.ProductionMode() {
		kCmtPageSize = 10
	} else {
		kCmtPageSize = 2
	}
}

type GetCmtsRespData struct {
	Items   []cmtSod.Cmt `json:"items"`
	HasNext bool         `json:"hasNext"`
}

func newGetCmtsRespData(cmts []da.DBCmt, hasNext bool) GetCmtsRespData {
	cmtsConverted := make([]cmtSod.Cmt, len(cmts))
	for i := 0; i < len(cmts); i++ {
		cmtsConverted[i] = apicom.NewCmt(&cmts[i])
	}
	res := GetCmtsRespData{}
	res.Items = cmtsConverted
	res.HasNext = hasNext
	return res
}

func getCmtsAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()

	parentID := clib.GetIDFromDict(params, "parentID")
	orderBy := jsonx.GetIntOrDefault(params, "sort")
	excludedCmts := clib.UnsafeGetIDArrayFromDict(params, "excluded")
	page := clib.GetPageParamFromDict(params)

	db := appDB.DB()
	var respData GetCmtsRespData
	var items []da.DBCmt
	var hasNext bool
	var err error

	// Selecting replies.
	if parentID != 0 {
		if uid == 0 {
			items, hasNext, err = da.Cmt.SelectReplies(db, &parentID, page, kCmtPageSize, da.CmtAGSelectRepliesOrderBy1(orderBy), true)
		} else if len(excludedCmts) == 0 {
			items, hasNext, err = da.Cmt.SelectRepliesUserMode(db, uid, &parentID, page, kCmtPageSize, da.CmtAGSelectRepliesUserModeOrderBy1(orderBy), true)
		} else {
			items, hasNext, err = da.Cmt.SelectRepliesUserModeFilterMode(db, uid, &parentID, excludedCmts, page, kCmtPageSize, da.CmtAGSelectRepliesUserModeFilterModeOrderBy1(orderBy), true)
		}
		if err != nil {
			appcm.PanicOn(err, "failed to select replies")
		}

		respData := newGetCmtsRespData(items, hasNext)
		return resp.MustComplete(respData)
	}

	// Selecting comments.
	host := clib.MustGetEntityInfoFromDict(params, "host")
	cmtRelTable, err := apicom.GetCmtRelationTable(host.Type)
	appcm.PanicOn(err, "Invalid host type")

	if uid == 0 {
		items, hasNext, err = da.ContentBaseCmtStatic.SelectRootCmts(db, cmtRelTable, host.ID, page, kCmtPageSize, da.ContentBaseCmtStaticAGSelectRootCmtsOrderBy1(orderBy), true)
	} else if len(excludedCmts) == 0 {
		items, hasNext, err = da.ContentBaseCmtStatic.SelectRootCmtsUserMode(db, cmtRelTable, uid, host.ID, page, kCmtPageSize, da.ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1(orderBy), true)
	} else {
		items, hasNext, err = da.ContentBaseCmtStatic.SelectRootCmtsUserModeFilterMode(db, cmtRelTable, uid, host.ID, excludedCmts, page, kCmtPageSize, da.ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1(orderBy), true)
	}

	appcm.PanicOn(err, "failed to select root comments")
	respData = newGetCmtsRespData(items, hasNext)

	return resp.MustComplete(respData)
}
