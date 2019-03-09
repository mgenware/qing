package profilep

import (
	"qing/app"
	"qing/app/template"
	"qing/da"
)

type ProfileData struct {
	da.UserTableSelectProfileResult
	template.LocalizedTemplateData

	UserURL string
	IconURL string
}

func NewProfileDataFromUser(u *da.UserTableSelectProfileResult) *ProfileData {
	d := &ProfileData{UserTableSelectProfileResult: *u}
	uid := u.ID

	d.IconURL = app.URL.UserAvatarURL250(uid, u.IconName)
	d.UserURL = app.URL.UserProfile(uid)
	return d
}
