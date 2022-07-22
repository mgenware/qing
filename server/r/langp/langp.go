/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package langp

import (
	"net/http"
	"qing/a/appHandler"
	"qing/a/handler"

	"golang.org/x/text/language/display"
)

const langScript = "langEntry"

// LangHandler handles route of lang settings.
func LangHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	langTags := appHandler.MainPage().LocalizationManager().LangTags()
	if len(langTags) == 0 {
		panic("No valid language defined")
	}

	en := display.English.Tags()
	var langInfoList []LangInfo
	for _, t := range langTags {
		info := LangInfo{ID: t.String(), Name: en.Name(t), LocalizedName: display.Self.Name(t)}
		langInfoList = append(langInfoList, info)
	}

	windData := LangWindData{Langs: langInfoList}

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	d.Scripts = appHandler.MainPage().ScriptString(langScript)
	d.WindData = windData
	d.ContentHTML = "<lang-page-view></lang-page-view>"

	return resp.MustComplete(&d)
}
