/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * Do not edit this file manually.
 * Automatically generated via `qing sod profile`.
 * See `lib/dev/sod/objects/profile.yaml` for details.
 ******************************************************************************************/

package profileSod

import "qing/sod/apiSod"

type GetProfileLangResult struct {
	UserLang     string             `json:"userLang,omitempty"`
	AutoOptionLS string             `json:"autoOptionLS,omitempty"`
	Langs        []apiSod.NameAndID `json:"langs,omitempty"`
}

func NewGetProfileLangResult(userLang string, autoOptionLS string, langs []apiSod.NameAndID) GetProfileLangResult {
	return GetProfileLangResult{
		UserLang: userLang,
		AutoOptionLS: autoOptionLS,
		Langs: langs,
	}
}
