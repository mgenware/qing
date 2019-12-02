package apidata

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
)

type Cmt struct {
	da.CmtData

	ID          string `json:"id"`
	UserURL     string `json:"userURL"`
	UserIconURL string `json:"userIconURL"`
}

func NewCmt(d *da.CmtData) *Cmt {
	r := &Cmt{CmtData: *d}
	r.ID = validator.EncodeID(d.CmtID)
	r.UserURL = app.URL.UserProfile(r.UserID)
	r.UserIconURL = app.URL.UserIconURL50(r.UserID, r.UserIconName)
	return r
}
