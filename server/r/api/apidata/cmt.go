package apidata

import (
	"qing/app"
	"qing/da"
	"qing/lib/validator"
)

type Cmt struct {
	da.CmtData

	EID         string `json:"id"`
	UserEID     string `json:"userID,omitempty"`
	UserURL     string `json:"userURL,omitempty"`
	UserIconURL string `json:"userIconURL,omitempty"`
}

func NewCmt(d *da.CmtData) *Cmt {
	r := &Cmt{CmtData: *d}
	r.EID = validator.EncodeID(d.CmtID)
	r.UserEID = validator.EncodeID(d.UserID)
	r.UserURL = app.URL.UserProfile(r.UserID)
	r.UserIconURL = app.URL.UserIconURL50(r.UserID, r.UserIconName)
	return r
}

type Reply struct {
	da.ReplyData

	EID         string `json:"id"`
	UserEID     string `json:"userID,omitempty"`
	ToUserEID   string `json:"toUserID,omitempty"`
	UserURL     string `json:"userURL,omitempty"`
	UserIconURL string `json:"userIconURL,omitempty"`
	ToUserURL   string `json:"toUserURL,omitempty"`
}

func NewReply(d *da.ReplyData) *Reply {
	r := &Reply{ReplyData: *d}
	r.EID = validator.EncodeID(d.ID)
	r.UserEID = validator.EncodeID(d.UserID)
	r.ToUserEID = validator.EncodeID(d.ToUserID)
	r.UserURL = app.URL.UserProfile(r.UserID)
	r.UserIconURL = app.URL.UserIconURL50(r.UserID, r.UserIconName)
	r.ToUserURL = app.URL.UserProfile(r.ToUserID)
	return r
}
