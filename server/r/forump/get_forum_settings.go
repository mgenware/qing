/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import (
	"net/http"
	"qing/a/app"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/r/sys"

	"github.com/go-chi/chi/v5"
)

const forumSettingsScript = "forumSettingsEntry"

// ForumSettingsPageWindData ...
type ForumSettingsPageWindData struct {
	EID string
}

// NewForumSettingsPageWindData creates a new ForumSettingsPageWindData.
func NewForumSettingsPageWindData(fid uint64) ForumSettingsPageWindData {
	d := ForumSettingsPageWindData{}
	d.EID = clib.EncodeID(fid)
	return d
}

func getForumSettings(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	fid, err := clib.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}

	// Page title and content will be set on frontend side.
	d := app.MainPageData("", "")
	d.Scripts = appHandler.MainPage().ScriptString(forumSettingsScript)
	d.WindData = NewForumSettingsPageWindData(fid)

	return resp.MustComplete(&d)
}
