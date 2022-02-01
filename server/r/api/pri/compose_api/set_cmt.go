/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import (
	"fmt"
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/defs"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
	"qing/sod/cmt/cmt"
	"time"
)

type SetCmtResponse struct {
	Cmt *cmt.Cmt `json:"cmt"`
}

func getCmtTA(hostType int) (da.CmtInterface, error) {
	switch hostType {
	case defs.Shared.EntityPost:
		return da.Post, nil
	case defs.Shared.EntityQuestion:
		return da.Question, nil
	case defs.Shared.EntityAnswer:
		return da.Answer, nil
	default:
		return nil, fmt.Errorf("Unknown cmt data provider: %v", hostType)
	}
}

func setCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	user := resp.User()
	uid := user.ID

	id := clib.GetIDFromDict(params, "id")
	contentData := clib.MustGetDictFromDict(params, "contentData")
	content, sanitizedToken := appService.Get().Sanitizer.Sanitize(clib.MustGetTextFromDict(contentData, "contentHTML"))

	db := appDB.DB()
	if id == 0 {
		// Create a comment or reply.
		hostType := clib.MustGetIntFromDict(params, "hostType")
		hostID := clib.MustGetIDFromDict(params, "hostID")
		parentID := clib.GetIDFromDict(params, "parentID")

		cmtCore, err := getCmtTA(hostType)
		app.PanicIfErr(err)

		captResult, err := appService.Get().Captcha.Verify(uid, hostType, "", app.CoreConfig().DevMode())
		app.PanicIfErr(err)

		if captResult != 0 {
			return resp.MustFailWithCode(captResult)
		}

		var cmtID uint64
		if parentID != 0 {
			cmtID, err = cmtCore.InsertReply(db, parentID, content, uid, hostID, sanitizedToken, captResult)
		} else {
			cmtID, err = cmtCore.InsertCmt(db, content, uid, hostID, sanitizedToken, captResult)
		}
		app.PanicIfErr(err)

		// Construct a DB cmt object without interacting with DB.
		now := time.Now()
		d := &da.CmtData{ID: cmtID}
		d.RawCreatedAt = now
		d.RawModifiedAt = now
		d.ContentHTML = content
		d.UserID = uid
		d.UserName = user.Name
		d.UserIconName = user.IconName

		cmt := apicom.NewCmt(d)
		respData := SetCmtResponse{Cmt: &cmt}
		return resp.MustComplete(respData)
	} else {
		now := time.Now()

		err := da.Cmt.EditCmt(db, id, uid, content, now, sanitizedToken)
		app.PanicIfErr(err)
		cmt := &cmt.Cmt{EID: clib.EncodeID(id)}
		cmt.ContentHTML = content
		cmt.ModifiedAt = clib.TimeString(now)

		// NOTE: when editing a comment or reply, this always returns response the `cmt` field set.
		respData := &SetCmtResponse{Cmt: cmt}
		return resp.MustComplete(respData)
	}
}
