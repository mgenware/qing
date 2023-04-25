/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * Do not edit this file manually.
 * Automatically generated via `qing sod app`.
 * See `lib/dev/sod/objects/app.yaml` for details.
 ******************************************************************************************/

package appSod

type MainPageData struct {
	UserID         string `json:"userID,omitempty"`
	UserName       string `json:"userName,omitempty"`
	UserURL        string `json:"userURL,omitempty"`
	UserIconURL    string `json:"userIconURL,omitempty"`
	UserAdmin      bool   `json:"userAdmin,omitempty"`
	Lang           string `json:"lang,omitempty"`
	PostPerm       int    `json:"postPerm,omitempty"`
	Forums         bool   `json:"forums,omitempty"`
	WindDataString string `json:"windDataString,omitempty"`
}

func NewMainPageData(userID string, userName string, userURL string, userIconURL string, userAdmin bool, lang string, postPerm int, forums bool, windDataString string) MainPageData {
	return MainPageData{
		UserID: userID,
		UserName: userName,
		UserURL: userURL,
		UserIconURL: userIconURL,
		UserAdmin: userAdmin,
		Lang: lang,
		PostPerm: postPerm,
		Forums: forums,
		WindDataString: windDataString,
	}
}
