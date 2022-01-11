/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package cmtapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/defs"
	"qing/a/handler"
	"qing/app"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apicom"
	"qing/sod/cmt/cmt"
)

var kCmtPageSize int

func init() {
	cc := app.CoreConfig()
	if cc.ProductionMode() {
		kCmtPageSize = 10
	} else if cc.DevMode() {
		kCmtPageSize = 3
	} else {
		kCmtPageSize = 2
	}
}

type GetCmtsRespData struct {
	Items   []cmt.Cmt `json:"items"`
	HasNext bool      `json:"hasNext"`
}

type GetRepliesRespData struct {
	Items   []cmt.Reply `json:"items"`
	HasNext bool        `json:"hasNext"`
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

func newGetRepliesRespData(replies []da.CmtData, hasNext bool) GetRepliesRespData {
	repliesConverted := make([]cmt.Reply, len(replies))
	for i := 0; i < len(replies); i++ {
		repliesConverted[i] = apicom.NewReply(&replies[i])
	}
	res := GetRepliesRespData{}
	res.Items = repliesConverted
	res.HasNext = hasNext
	return res
}

func getCmts(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	parentCmtID := validator.GetIDFromDict(params, "parentCmtID")
	page := validator.GetPageParamFromDict(params)

	db := appDB.DB()
	var respData GetCmtsRespData
	var items []da.CmtData
	var hasNext bool
	var err error

	// Selecting replies.
	if parentCmtID != 0 {
		if uid == 0 {
			items, hasNext, err = da.Reply.SelectReplies(db, parentCmtID, page, kCmtPageSize)
		} else {
			items, hasNext, err = da.Reply.SelectRepliesWithLike(db, uid, parentCmtID, page, kCmtPageSize)
		}
		if err != nil {
			app.PanicIfErr(err)
		}

		respData := newGetRepliesRespData(items, hasNext)
		return resp.MustComplete(respData)
	}

	// Selecting comments.
	hostID := validator.MustGetIDFromDict(params, "hostID")
	hostType := validator.MustGetIntFromDict(params, "hostType")

	switch hostType {
	case defs.Shared.EntityPost:
		{
			if uid == 0 {
				items, hasNext, err = da.Post.SelectCmts(db, hostID, page, kCmtPageSize)
			} else {
				items, hasNext, err = da.Post.SelectCmtsWithLike(db, uid, hostID, page, kCmtPageSize)
			}
			if err != nil {
				app.PanicIfErr(err)
			}
			respData = newGetCmtsRespData(items, hasNext)
		}
	default:
		{
			panic("Unsupported entity type")
		}
	}
	return resp.MustComplete(respData)
}
