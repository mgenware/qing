package composeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apidata"
	"time"
)

type SetCmtResponse struct {
	Cmt *apidata.Cmt `json:"cmt"`
}

func getCmtTA(hostType int) (da.CmtCore, error) {
	switch hostType {
	case defs.EntityPost:
		return da.Post, nil
	default:
		return nil, fmt.Errorf("Unknown cmt data provider: %v", hostType)
	}
}

func setCmt(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	user := resp.User()
	uid := user.ID

	id := validator.GetIDFromDict(params, "id")
	contentData := validator.MustGetDictFromDict(params, "contentData")
	content, sanitizedToken := app.Service.Sanitizer.Sanitize(validator.MustGetStringFromDict(contentData, "contentHTML"))

	if id == 0 {
		// We are creating a new cmt.
		hostType := validator.MustGetIntFromDict(params, "hostType")
		hostID := validator.MustGetIDFromDict(params, "hostID")
		capt := validator.MustGetStringFromDict(contentData, "captcha")
		toUserID := validator.GetIDFromDict(params, "toUserID")
		parentCmtID := validator.GetIDFromDict(params, "parentCmtID")

		cmtCore, err := getCmtTA(hostType)
		app.PanicIfErr(err)

		captResult, err := app.Service.Captcha.Verify(uid, hostType, capt, app.Config.DevMode())
		app.PanicIfErr(err)

		if captResult != 0 {
			resp.MustFailWithCode(captResult)
			return
		}

		var cmtID uint64
		if toUserID != 0 {
			cmtID, err = cmtCore.InsertReply(app.DB, content, uid, toUserID, parentCmtID, sanitizedToken, captResult)
		} else {
			cmtID, err = cmtCore.InsertCmt(app.DB, content, uid, hostID, sanitizedToken, captResult)
		}
		app.PanicIfErr(err)

		// Construct a DB cmt object without interacting with DB.
		now := time.Now()
		cmtd := &da.CmtData{CmtID: cmtID}
		cmtd.CreatedAt = now
		cmtd.Content = content
		cmtd.UserID = uid
		cmtd.UserName = user.Name
		cmtd.UserIconName = user.IconName

		cmt := apidata.NewCmt(cmtd)
		cmt.Content = content

		respData := &SetCmtResponse{Cmt: cmt}
		resp.MustComplete(respData)
	} else {
		// Editing a cmt.
		err := da.Cmt.EditCmt(app.DB, id, uid, content, sanitizedToken)
		app.PanicIfErr(err)

		cmt := &apidata.Cmt{ID: validator.EncodeID(id)}
		cmt.Content = content
		now := time.Now()
		cmt.ModifiedAt = &now

		respData := &SetCmtResponse{Cmt: cmt}
		resp.MustComplete(respData)
	}
}
