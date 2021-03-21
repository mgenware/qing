/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package rcom

import (
	"qing/app"
	"qing/lib/validator"
	"time"
)

var vUserView = app.MainPageManager.MustParseView("/com/userItemView.html")

// UserItemViewData contains properties required to generate a user item view.
type UserItemViewData struct {
	ItemEID string
	// ItemType is part of ID of <edit-bar>.
	ItemType       int
	UserEID        string
	UserName       string
	UserURL        string
	UserIconURL    string
	ItemCreatedAt  time.Time
	ItemModifiedAt *time.Time
}

// GetUserItemViewHTML returns user item view HTML with the given params.
func GetUserItemViewHTML(uid uint64, name, iconName, itemEID string, itemType int, itemCreated time.Time, itemModified *time.Time) string {
	d := &UserItemViewData{}
	d.ItemEID = itemEID
	d.UserEID = validator.EncodeID(uid)
	d.UserName = name
	d.UserURL = app.URL.UserProfile(uid)
	d.UserIconURL = app.URL.UserIconURL50(uid, iconName)
	d.ItemCreatedAt = itemCreated
	d.ItemModifiedAt = itemModified
	d.ItemType = itemType
	return vUserView.MustExecuteToString(d)
}
