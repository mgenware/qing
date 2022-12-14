/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package apicom

import (
	"fmt"
	"qing/a/appHandler"
	"qing/sod/apiSod"

	"golang.org/x/text/language/display"
)

func GetSiteSupportedLangs() ([]apiSod.NameAndID, error) {
	langTags := appHandler.MainPage().LocalizationManager().LangTags()
	if len(langTags) == 0 {
		return nil, fmt.Errorf("no valid language defined")
	}

	en := display.English.Tags()
	var langInfoList []apiSod.NameAndID
	for _, t := range langTags {
		info := apiSod.NewNameAndID(t.String(), en.Name(t)+" ("+display.Self.Name(t)+")")
		langInfoList = append(langInfoList, info)
	}
	return langInfoList, nil
}
