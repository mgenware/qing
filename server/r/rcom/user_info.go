/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"qing/app/appURL"
	"qing/lib/fmtx"
)

// UserInfo contains general information about a user.
type UserInfo struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	URL     string `json:"url"`
	IconURL string `json:"iconURL"`
}

// NewUserInfo creates a new UserInfo with the given params.
func NewUserInfo(uid uint64, name, iconName string) UserInfo {
	r := UserInfo{}
	r.Name = name
	r.URL = appURL.Get().UserProfile(uid)
	r.IconURL = appURL.Get().UserIconURL50(uid, iconName)
	r.ID = fmtx.EncodeID(uid)
	return r
}
