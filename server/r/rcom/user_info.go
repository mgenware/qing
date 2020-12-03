package rcom

import (
	"qing/app"
	"qing/lib/validator"
)

// UserInfo contains general information about a user.
type UserInfo struct {
	EID     string `json:"eid"`
	Name    string `json:"name"`
	URL     string `json:"url"`
	IconURL string `json:"iconURL"`
}

// NewUserInfo creates a new UserInfo with the given params.
func NewUserInfo(uid uint64, name, iconName string) *UserInfo {
	r := &UserInfo{}
	r.EID = validator.EncodeID(uid)
	r.Name = name
	r.URL = app.URL.UserProfile(uid)
	r.IconURL = app.URL.UserIconURL50(uid, iconName)
	r.EID = validator.EncodeID(uid)
	return r
}
