/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import (
	"net/http"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/r/sys"

	"github.com/go-chi/chi/v5"
)

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

func forumSettingsPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	fid, err := clib.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundPage(w, r)
	}

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("forumSettingsEntry")
	d.ExtraState = NewForumSettingsPageWindData(fid)

	return resp.MustComplete(&d)
}
