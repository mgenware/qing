/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import (
	"net/http"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/lib/validator"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

// ForumSettingsPageWindData ...
type ForumSettingsPageWindData struct {
	EID string
}

// NewForumSettingsPageWindData creates a new ForumSettingsPageWindData.
func NewForumSettingsPageWindData(fid uint64) ForumSettingsPageWindData {
	d := ForumSettingsPageWindData{}
	d.EID = validator.EncodeID(fid)
	return d
}

func getForumSettings(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	fid, err := validator.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	d.Scripts = appHandler.MainPage.AssetsManager.JS.ForumSettings
	d.WindData = NewForumSettingsPageWindData(fid)

	return resp.MustComplete(d)
}
