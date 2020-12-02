package rcom

import (
	"qing/app"
	"qing/lib/validator"
	"time"
)

// UserItemViewData contains properties required to generate a user item view.
type UserItemViewData struct {
	ItemEID        string
	UserEID        string
	UserName       string
	UserURL        string
	UserIconURL    string
	ItemCreatedAt  time.Time
	ItemModifiedAt *time.Time
}

var vUserView = app.MasterPageManager.MustParseView("/cm/userItemView.html")

// GetUserItemViewHTML returns user item view HTML with the given params.
func GetUserItemViewHTML(uid uint64, name, iconName string, itemEID string, itemCreated time.Time, itemModified *time.Time) string {
	d := &UserItemViewData{}
	d.ItemEID = itemEID
	d.UserEID = validator.EncodeID(uid)
	d.UserName = name
	d.UserURL = app.URL.UserProfile(uid)
	d.UserIconURL = app.URL.UserIconURL50(uid, iconName)
	d.ItemCreatedAt = itemCreated
	d.ItemModifiedAt = itemModified
	return vUserView.MustExecuteToString(d)
}
