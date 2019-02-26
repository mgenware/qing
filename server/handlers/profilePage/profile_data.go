package profilePage

import (
	"qing/app"
	"qing/app/template"
	"qing/da"
)

type ProfileData struct {
	da.UserTableSelectUserProfileResult
	template.LocalizedTemplateData

	UserURL string
	IconURL string
}

func NewProfileDataFromUser(u *da.UserTableSelectUserProfileResult) *ProfileData {
	d := &ProfileData{UserTableSelectUserProfileResult: *u}
	uid := u.ID

	d.IconURL = app.URL.UserAvatarURL250(uid, u.IconName)
	d.UserURL = app.URL.UserProfile(uid)
	return d
}
