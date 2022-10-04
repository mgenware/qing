/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appService"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
	"qing/sod/cmtSod"
	"time"
)

type SetCmtResponse struct {
	Cmt *cmtSod.Cmt `json:"cmt"`
}

func setCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	user := resp.User()
	uid := user.ID

	id := clib.GetIDFromDict(params, "id")
	contentData := clib.MustGetDictFromDict(params, "contentData")
	content, sanitizedToken := appService.Get().Sanitizer.Sanitize(clib.MustGetTextFromDict(contentData, "contentHTML"))

	db := appDB.DB()
	if id == 0 {
		// Create a comment or reply.
		host := clib.MustGetEntityInfoFromDict(params, "host")
		parentID := clib.GetIDFromDict(params, "parentID")

		cmtHostTable, err := apicom.GetCmtHostTable(host.Type)
		app.PanicOn(err)
		cmtRelationTable, err := apicom.GetCmtRelationTable(host.Type)
		app.PanicOn(err)

		captResult := 0
		var cmtID uint64
		if parentID != 0 {
			cmtID, err = da.ContentBaseCmtStatic.InsertReply(db, cmtHostTable, content, host.ID, uint8(host.Type), parentID, uid, sanitizedToken, captResult)
		} else {
			cmtID, err = da.ContentBaseCmtStatic.InsertCmt(db, cmtRelationTable, cmtHostTable, content, host.ID, uint8(host.Type), uid, sanitizedToken, captResult)
		}
		app.PanicOn(err)

		// Update `last_replied_at` if necessary.
		if host.Type == appdef.ContentBaseTypePost {
			err = da.Post.RefreshLastRepliedAt(db, host.ID)
			app.PanicOn(err)
		}

		// Construct a DB cmt object without interacting with DB.
		now := time.Now()
		d := &da.CmtResult{ID: cmtID}
		d.RawCreatedAt = now
		d.RawModifiedAt = now
		d.ContentHTML = content
		d.UserID = &uid
		d.UserName = &user.Name
		d.UserIconName = &user.IconName

		cmt := apicom.NewCmt(d)
		respData := SetCmtResponse{Cmt: &cmt}
		return resp.MustComplete(respData)
	} else {
		err := da.Cmt.EditCmt(db, id, uid, content, sanitizedToken)
		app.PanicOn(err)
		cmt := &cmtSod.Cmt{Eid: clib.EncodeID(id)}
		cmt.ContentHTML = content

		now := time.Now()
		cmt.ModifiedAt = clib.TimeString(now)

		// NOTE: when editing a comment or reply, this always returns response the `cmt` field set.
		respData := &SetCmtResponse{Cmt: cmt}
		return resp.MustComplete(respData)
	}
}
