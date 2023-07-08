/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authp

import (
	"net/http"
	"qing/a/appHandler"
	"qing/a/handler"
)

func defaultPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	return defaultPageCore(w, r, "")
}

func defaultPageCore(w http.ResponseWriter, r *http.Request, extraScripts string) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	// Page title will be set on frontend side
	d := appHandler.MainPageData("", "")
	assm := appHandler.MainPage().AssetManager()
	d.Scripts = assm.MustGetLangScript(resp.Lang(), authLSKey) + appHandler.MainPage().AssetManager().MustGetScript("authEntry") + extraScripts

	return resp.MustComplete(&d)
}
