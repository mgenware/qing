/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
)

type infoData struct {
	da.DBUserForEditing

	IconURL string `json:"iconURL"`
}

func newInfoData(u *da.DBUserForEditing) infoData {
	d := infoData{DBUserForEditing: *u}
	d.IconURL = appURL.Get().UserIconURL250(u.ID, u.IconName)
	return d
}

func info(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := resp.UserID()

	dbInfo, err := da.User.SelectEditingData(appDB.DB(), uid)
	appcm.PanicOn(err)

	data := newInfoData(&dbInfo)
	return resp.MustComplete(data)
}
