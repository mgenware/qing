/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/lib/clib"
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
	ItemCreatedAt  string
	ItemModifiedAt string
	ExtraLink      string
	ExtraLinkLS    string
}

// PostUserAppInput contains parameters to create a PostUserAppData.
type PostUserAppInput struct {
	UID          uint64
	Name         string
	IconName     string
	ItemEID      string
	ItemType     int
	ItemCreated  string
	ItemModified string
	ExtraLink    string
	ExtraLinkLS  string
}

// NewPostUserAppInput creates a PostUserAppInput.
func NewPostUserAppInput(uid uint64, name, iconName, itemEID string, itemType int, itemCreated string, itemModified string) PostUserAppInput {
	return PostUserAppInput{
		UID:          uid,
		Name:         name,
		IconName:     iconName,
		ItemEID:      itemEID,
		ItemType:     itemType,
		ItemCreated:  itemCreated,
		ItemModified: itemModified,
	}
}

// GetPostUserAppHTML generates an HTML string for frontend `PostUserApp`.
func GetPostUserAppHTML(input *PostUserAppInput) string {
	d := &PostUserAppData{}
	d.ItemEID = input.ItemEID
	d.UserEID = clib.EncodeID(input.UID)
	d.UserName = input.Name
	d.UserURL = appURL.Get().UserProfile(input.UID)
	d.UserIconURL = appURL.Get().UserIconURL50(input.UID, input.IconName)
	d.ItemCreatedAt = input.ItemCreated
	d.ItemModifiedAt = input.ItemModified
	d.EntityType = input.ItemType
	d.ExtraLink = input.ExtraLink
	d.ExtraLinkLS = input.ExtraLinkLS
	return vUserView.MustExecuteToString(d)
}
