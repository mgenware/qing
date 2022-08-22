/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appURL"
	"qing/a/handler"
	"qing/da"
)

type infoData struct {
	da.UserAGSelectEditingDataResult

	IconURL string `json:"iconURL"`
}

func newInfoData(u *da.UserAGSelectEditingDataResult) infoData {
	d := infoData{UserAGSelectEditingDataResult: *u}
	d.IconURL = appURL.Get().UserIconURL250(u.ID, u.IconName)
	return d
}

func info(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := resp.UserID()

	dbInfo, err := da.User.SelectEditingData(appDB.DB(), uid)
	if err != nil {
		return resp.MustFail(err)
	}

	data := newInfoData(&dbInfo)
	return resp.MustComplete(data)
}
