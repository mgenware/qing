package rcom

import (
	"fmt"
	"qing/app"
	"qing/da"
)

// UserThreadData is a data wrapper around PostTableSelectItemsForUserProfileResult.
type UserThreadData struct {
	da.UserThreadInterface

	ThreadURL   string
	UserURL     string
	UserIconURL string
}

// NewUserThreadData creates a new StdPageItemData.
func NewUserThreadData(item *da.UserThreadInterface) (*UserThreadData, error) {
	d := &UserThreadData{UserThreadInterface: *item}
	switch item.ThreadType {
	case da.Constants.ThreadTypePost:
		d.ThreadURL = app.URL.Post(item.ID)
		break

	case da.Constants.ThreadTypeQuestion:
		d.ThreadURL = app.URL.Question(item.ID)
		break

	case da.Constants.ThreadTypeDiscussion:
		d.ThreadURL = app.URL.Discussion(item.ID)
		break

	default:
		return nil, fmt.Errorf("Invalid item type %v", item.ThreadType)
	}
	uid := item.UserID
	d.UserURL = app.URL.UserProfile(uid)
	d.UserIconURL = app.URL.UserIconURL50(uid, item.UserIconName)
	return d, nil
}
