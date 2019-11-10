package apidata

import (
	"qing/app"
	"qing/da"
)

type Cmt struct {
	da.PostCmtTableSelectCmtsResult

	UserURL     string `json:"userURL"`
	UserIconURL string `json:"userIconURL"`
}

func NewCmt(d *da.PostCmtTableSelectCmtsResult) *Cmt {
	r := &Cmt{PostCmtTableSelectCmtsResult: *d}
	r.UserURL = app.URL.UserProfile(r.UserID)
	r.UserIconURL = app.URL.UserIconURL50(r.UserID, r.UserIconName)
	return r
}
