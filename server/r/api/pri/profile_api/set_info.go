package profileapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/da"
)

type infoData struct {
	da.UserTableSelectEditingDataResult
	handler.LocalizedTemplateData

	IconURL string `json:"iconURL"`
}

func newInfoData(u *da.UserTableSelectEditingDataResult) *infoData {
	d := &infoData{UserTableSelectEditingDataResult: *u}
	d.IconURL = app.URL.UserIconURL250(u.ID, u.IconName)
	return d
}

func getInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := resp.UserID()

	dbInfo, err := da.User.SelectEditingData(app.DB, uid)
	if err != nil {
		return resp.MustFail(err)
	}

	data := newInfoData(dbInfo)
	return resp.MustComplete(data)
}

func setInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	sUser := resp.User()
	uid := resp.UserID()

	nick, _ := params["name"].(string)
	if nick == "" {
		panic("The argument `name` cannot be empty")
	}
	website, _ := params["website"].(string)
	company, _ := params["company"].(string)
	location, _ := params["location"].(string)

	// Update DB
	err := da.User.UpdateProfile(app.DB, uid, nick, website, company, location)
	if err != nil {
		return resp.MustFail(err)
	}
	// Update session
	sUser.Name = nick
	sid := cm.ContextSID(r.Context())
	err = app.UserManager.SessionManager.SetUserSession(sid, sUser)
	if err != nil {
		return resp.MustFail(err)
	}

	return resp.MustComplete(nick)
}
