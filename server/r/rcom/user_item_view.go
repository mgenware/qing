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

var vUserView = appHandler.MainPage().MustParseView("/com/userItemView.html")

// UserItemViewData contains properties required to generate a user item view.
type UserItemViewData struct {
	ItemEID string
	// ItemType is part of ID of <edit-bar>.
	ItemType       int
	UserEID        string
	UserName       string
	UserURL        string
	UserIconURL    string
	UserStatusHTML string
	ItemCreatedAt  string
	ItemModifiedAt string
}

// GetUserItemViewHTML returns user item view HTML with the given params.
func GetUserItemViewHTML(uid uint64, name, iconName, itemEID, statusHTML string, itemType int, itemCreated string, itemModified string) string {
	d := &UserItemViewData{}
	d.ItemEID = itemEID
	d.UserEID = fmtx.EncodeID(uid)
	d.UserName = name
	d.UserStatusHTML = statusHTML
	d.UserURL = appURL.Get().UserProfile(uid)
	d.UserIconURL = appURL.Get().UserIconURL50(uid, iconName)
	d.ItemCreatedAt = itemCreated
	d.ItemModifiedAt = itemModified
	d.ItemType = itemType
	return vUserView.MustExecuteToString(d)
}
