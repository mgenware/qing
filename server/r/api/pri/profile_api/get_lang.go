/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"fmt"
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/da"
	"qing/sod/profileSod"

	"golang.org/x/text/language/display"
)

func lang(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := resp.UserID()

	langTags := appHandler.MainPage().LocalizationManager().LangTags()
	if len(langTags) == 0 {
		panic(fmt.Errorf("no valid language defined"))
	}

	en := display.English.Tags()
	var langInfoList []profileSod.ProfileLang
	for _, t := range langTags {
		info := profileSod.NewProfileLang(t.String(), en.Name(t)+" ("+display.Self.Name(t)+")")
		langInfoList = append(langInfoList, info)
	}

	userLang, err := da.User.SelectLang(appDB.Get().DB(), uid)
	app.PanicOn(err)

	res := profileSod.NewGetProfileLangResult(userLang, resp.LS().AutoLangOption, langInfoList)
	return resp.MustComplete(res)
}
