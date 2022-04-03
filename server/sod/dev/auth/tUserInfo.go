/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

 /******************************************************************************************
  * Do not edit this file manually.
  * Automatically generated via `qing sod dev/auth/tUserInfo`.
  * See `lib/dev/sod/objects/dev/auth/tUserInfo.yaml` for details.
  ******************************************************************************************/

package authSod

type TUserInfo struct {

	Admin   *bool  `json:"admin,omitempty"`
	ID      string `json:"id"`
	IconURL string `json:"iconURL"`
	Url     string `json:"url"`
	Name    string `json:"name"`
}

func NewTUserInfo(admin *bool, id string, iconURL string, url string, name string) TUserInfo {
	return TUserInfo{
		Admin: admin,
		ID: id,
		IconURL: iconURL,
		Url: url,
		Name: name,
	}
}
