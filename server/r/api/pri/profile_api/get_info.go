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
	"qing/a/handler"
	"qing/da"
)

type infoData struct {
	da.UserTableSelectEditingDataResult

	IconURL string `json:"iconURL"`
}

func newInfoData(u *da.UserTableSelectEditingDataResult) infoData {
	d := infoData{UserTableSelectEditingDataResult: *u}
	d.IconURL = appURL.Get().UserIconURL250(u.ID, u.IconName)
	return d
}

func getInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := resp.UserID()

	dbInfo, err := da.User.SelectEditingData(appDB.DB(), uid)
	if err != nil {
		return resp.MustFail(err)
	}

	data := newInfoData(&dbInfo)
	return resp.MustComplete(data)
}
