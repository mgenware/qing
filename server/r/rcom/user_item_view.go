/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/lib/fmtx"
)

var vUserView = appHandler.MainPage().MustParseView("/com/postUserApp.html")

// PostUserAppData provides data for frontend `PostUserApp`.
type PostUserAppData struct {
	ItemEID        string
	EntityType     int
	UserEID        string
	UserName       string
	UserURL        string
	UserIconURL    string
	UserStatus     string
	ItemCreatedAt  string
	ItemModifiedAt string
}

// GetPostUserAppHTML generates an HTML string for frontend `PostUserApp`.
func GetPostUserAppHTML(uid uint64, name, iconName, status, itemEID string, itemType int, itemCreated string, itemModified string) string {
	d := &PostUserAppData{}
	d.ItemEID = itemEID
	d.UserEID = fmtx.EncodeID(uid)
	d.UserName = name
	d.UserStatus = status
	d.UserURL = appURL.Get().UserProfile(uid)
	d.UserIconURL = appURL.Get().UserIconURL50(uid, iconName)
	d.ItemCreatedAt = itemCreated
	d.ItemModifiedAt = itemModified
	d.EntityType = itemType
	return vUserView.MustExecuteToString(d)
}
