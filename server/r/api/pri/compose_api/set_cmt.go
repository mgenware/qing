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
	"qing/lib/fmtx"
	"qing/lib/validator"
	"qing/r/api/apicom"
	"qing/sod/cmt/cmt"
	"time"
)

type SetCmtResponse struct {
	Cmt *cmt.Cmt `json:"cmt"`
}

// On web side, replies are incorporated into the comment type, so here we're returning
// a `Reply` object with the exact same name of `cmt`.
type SetCmtReplyResponse struct {
	Reply *cmt.Reply `json:"cmt"`
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

	id := validator.GetIDFromDict(params, "id")
	contentData := validator.MustGetDictFromDict(params, "contentData")
	content, sanitizedToken := appService.Get().Sanitizer.Sanitize(validator.MustGetTextFromDict(contentData, "contentHTML"))

	db := appDB.DB()
	if id == 0 {
		// Create a comment or reply.
		hostType := validator.MustGetIntFromDict(params, "hostType")
		hostID := validator.MustGetIDFromDict(params, "hostID")
		toUserID := validator.GetIDFromDict(params, "toUserID")
		parentCmtID := validator.GetIDFromDict(params, "parentCmtID")

		cmtCore, err := getCmtTA(hostType)
		app.PanicIfErr(err)

		captResult, err := appService.Get().Captcha.Verify(uid, hostType, "", app.CoreConfig().DevMode())
		app.PanicIfErr(err)

		if captResult != 0 {
			return resp.MustFailWithCode(captResult)
		}

		var cmtID uint64
		if parentCmtID != 0 {
			if toUserID == 0 {
				panic("Missing param \"toUserID\"")
			}
			cmtID, err = cmtCore.InsertReply(db, content, uid, toUserID, parentCmtID, hostID, sanitizedToken, captResult)
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
		d.ToUserID = toUserID

		if parentCmtID != 0 && toUserID != 0 {
			// `toUserID` is ignored if `parentCmtID` is not available.
			toUserName, err := da.User.SelectName(db, toUserID)
			app.PanicIfErrEx(err, "GetToUserName")
			d.ToUserID = toUserID
			d.ToUserName = toUserName
			rpl := apicom.NewReply(d)
			respData := SetCmtReplyResponse{Reply: &rpl}
			return resp.MustComplete(respData)
		} else {
			cmt := apicom.NewCmt(d)
			respData := SetCmtResponse{Cmt: &cmt}
			return resp.MustComplete(respData)
		}
	} else {
		// Edit a comment or reply.
		isReply := validator.MustGetIntFromDict(params, "isReply")
		now := time.Now()

		if isReply == 0 {
			err := da.Cmt.EditCmt(db, id, uid, content, now, sanitizedToken)
			app.PanicIfErr(err)
		} else {
			err := da.Reply.EditReply(db, id, uid, content, now, sanitizedToken)
			app.PanicIfErr(err)
		}
		cmt := &cmt.Cmt{EID: fmtx.EncodeID(id)}
		cmt.ContentHTML = content
		cmt.ModifiedAt = fmtx.Time(now)

		// NOTE: when editing a comment or reply, this always returns response the `cmt` field set.
		respData := &SetCmtResponse{Cmt: cmt}
		return resp.MustComplete(respData)
	}
}
