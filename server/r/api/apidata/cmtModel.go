package apidata

import (
	"qing/app"
	"qing/da"
)

type CmtModel struct {
	da.PostCmtTableSelectCmtsResult

	UserURL     string
	UserIconURL string
}

func NewCmtModel(d *da.PostCmtTableSelectCmtsResult) *CmtModel {
	r := &CmtModel{PostCmtTableSelectCmtsResult: *d}
	r.UserURL = app.URL.UserProfile(r.UserID)
	r.UserIconURL = app.URL.UserIconURL50(r.UserID)
	return r
}
