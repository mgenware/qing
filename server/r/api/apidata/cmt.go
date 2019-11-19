package apidata

import (
	"qing/app"
	"qing/da"
)

type Cmt struct {
	da.SelectCmtResult

	UserURL     string `json:"userURL"`
	UserIconURL string `json:"userIconURL"`
}

func NewCmt(d *da.SelectCmtResult) *Cmt {
	r := &Cmt{SelectCmtResult: *d}
	r.UserURL = app.URL.UserProfile(r.UserID)
	r.UserIconURL = app.URL.UserIconURL50(r.UserID, r.UserIconName)
	return r
}
