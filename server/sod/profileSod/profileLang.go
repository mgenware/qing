/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * Do not edit this file manually.
 * Automatically generated via `qing sod profile/profileLang`.
 * See `lib/dev/sod/objects/profile/profileLang.yaml` for details.
 ******************************************************************************************/

package profileSod

type ProfileLang struct {
	ID            string `json:"id,omitempty"`
	Name          string `json:"name,omitempty"`
	LocalizedName string `json:"localizedName,omitempty"`
}

func NewProfileLang(id string, name string, localizedName string) ProfileLang {
	return ProfileLang{
		ID: id,
		Name: name,
		LocalizedName: localizedName,
	}
}

type GetProfileLangResult struct {
	UserLang string      `json:"userLang,omitempty"`
	[]Langs  ProfileLang `json:"langs,omitempty"`
}
