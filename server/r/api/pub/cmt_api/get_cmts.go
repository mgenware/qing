/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package cmtapi

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apicom"
)

var kCmtPageSize int

func init() {
	if app.Config.DevMode() {
		// Use a smaller for testing purposes.
		kCmtPageSize = 3
	} else {
		kCmtPageSize = 10
	}
}

type GetCmtsRespData struct {
	Items   []apicom.Cmt `json:"items"`
	HasNext bool         `json:"hasNext"`
}

type GetRepliesRespData struct {
	Items   []apicom.Reply `json:"items"`
	HasNext bool           `json:"hasNext"`
}

func newGetCmtsRespData(cmts []da.CmtData, hasNext bool) GetCmtsRespData {
	cmtsConverted := make([]apicom.Cmt, len(cmts))
	for i := 0; i < len(cmts); i++ {
		cmtsConverted[i] = apicom.NewCmt(&cmts[i])
	}
	res := GetCmtsRespData{}
	res.Items = cmtsConverted
	res.HasNext = hasNext
	return res
}

func newGetRepliesRespData(replies []da.ReplyData, hasNext bool) GetRepliesRespData {
	repliesConverted := make([]apicom.Reply, len(replies))
	for i := 0; i < len(replies); i++ {
		repliesConverted[i] = apicom.NewReply(&replies[i])
	}
	res := GetRepliesRespData{}
	res.Items = repliesConverted
	res.HasNext = hasNext
	return res
}

func getCmts(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	parentCmtID := validator.GetIDFromDict(params, "parentCmtID")
	page := validator.GetPageParamFromDict(params)

	db := app.DB
	// Selecting replies.
	if parentCmtID != 0 {
		replies, hasNext, err := da.Reply.SelectReplies(db, parentCmtID, page, kCmtPageSize)
		if err != nil {
			app.PanicIfErr(err)
		}

		respData := newGetRepliesRespData(replies, hasNext)
		return resp.MustComplete(respData)
	}

	// Selecting comments.
	hostID := validator.MustGetIDFromDict(params, "hostID")
	hostType := validator.MustGetIntFromDict(params, "hostType")
	var respData GetCmtsRespData
	switch hostType {
	case defs.Shared.EntityPost:
		{
			cmts, hasNext, err := da.Post.SelectCmts(db, hostID, page, kCmtPageSize)
			if err != nil {
				app.PanicIfErr(err)
			}
			respData = newGetCmtsRespData(cmts, hasNext)
		}
		break
	default:
		{
			panic("Unsupported entity type")
		}
	}
	return resp.MustComplete(respData)
}
