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
	"qing/app"
	"qing/app/appConfig"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appService"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apicom"
	"time"
)

type SetCmtResponse struct {
	Cmt *apicom.Cmt `json:"cmt"`
}

func getCmtTA(hostType int) (da.CmtInterface, error) {
	switch hostType {
	case defs.Shared.EntityPost:
		return da.Post, nil
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

		captResult, err := appService.Get().Captcha.Verify(uid, hostType, "", appConfig.Get().DevMode())
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
		d.CreatedAt = now
		d.ModifiedAt = now
		d.ContentHTML = content
		d.UserID = uid
		d.UserName = user.Name
		d.UserIconName = user.IconName
		d.ToUserID = toUserID
		toUserName, err := da.User.SelectName(db, toUserID)
		app.PanicIfErr(err)
		d.ToUserName = toUserName

		cmt := apicom.NewCmt(d)
		cmt.ContentHTML = content

		respData := SetCmtResponse{Cmt: &cmt}
		return resp.MustComplete(respData)
	} else {
		// Edit a comment or reply.
		isReply := validator.MustGetIntFromDict(params, "isReply")

		if isReply == 0 {
			err := da.Cmt.EditCmt(db, id, uid, content, sanitizedToken)
			app.PanicIfErr(err)
		} else {
			err := da.Reply.EditReply(db, id, uid, content, sanitizedToken)
			app.PanicIfErr(err)
		}
		cmt := &apicom.Cmt{EID: validator.EncodeID(id)}
		cmt.ContentHTML = content
		now := time.Now()
		cmt.ModifiedAt = now

		respData := &SetCmtResponse{Cmt: cmt}
		return resp.MustComplete(respData)
	}
}
