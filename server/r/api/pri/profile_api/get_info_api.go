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
	"qing/sod/iSod"
)

func createProfileInfo(u *da.DBUserForEditing) iSod.GetProfileInfo {
	iconURL := appURL.Get().UserIconURL250(u.ID, u.IconName)
	return iSod.NewGetProfileInfo(u, iconURL)
}

func infoAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := resp.UserID()

	dbInfo, err := da.User.SelectEditingData(appDB.DB(), uid)
	appcm.PanicOn(err, "failed to select user info")

	data := createProfileInfo(&dbInfo)
	return resp.MustComplete(data)
}
