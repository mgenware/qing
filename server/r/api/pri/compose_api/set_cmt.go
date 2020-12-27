package composeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apicom"
	"time"
)

type SetCmtResponse struct {
	Cmt *apicom.Cmt `json:"cmt"`
}

func getCmtTA(hostType int) (da.CmtInterface, error) {
	switch hostType {
	case defs.Shared.EntityPost:
		return da.Post, nil
	default:
		return nil, fmt.Errorf("Unknown cmt data provider: %v", hostType)
	}
}

func setCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	user := resp.User()
	uid := user.ID

	id := validator.GetIDFromDict(params, "id")
	contentData := validator.MustGetDictFromDict(params, "contentData")
	content, sanitizedToken := app.Service.Sanitizer.Sanitize(validator.MustGetTextFromDict(contentData, "contentHTML"))

	if id == 0 {
		// We are creating a new cmt.
		hostType := validator.MustGetIntFromDict(params, "hostType")
		hostID := validator.MustGetIDFromDict(params, "hostID")
		capt := validator.MustGetStringFromDict(contentData, "captcha", defs.Shared.MaxCaptchaLen)
		toUserID := validator.GetIDFromDict(params, "toUserID")
		parentCmtID := validator.GetIDFromDict(params, "parentCmtID")

		cmtCore, err := getCmtTA(hostType)
		app.PanicIfErr(err)

		captResult, err := app.Service.Captcha.Verify(uid, hostType, capt, app.Config.DevMode())
		app.PanicIfErr(err)

		if captResult != 0 {
			return resp.MustFailWithCode(captResult)
		}

		var cmtID uint64
		if parentCmtID != 0 {
			cmtID, err = cmtCore.InsertReply(app.DB, content, uid, toUserID, parentCmtID, hostID, sanitizedToken, captResult)
		} else {
			cmtID, err = cmtCore.InsertCmt(app.DB, content, uid, hostID, sanitizedToken, captResult)
		}
		app.PanicIfErr(err)

		// Construct a DB cmt object without interacting with DB.
		now := time.Now()
		cmtd := &da.CmtData{CmtID: cmtID}
		cmtd.CreatedAt = now
		cmtd.ContentHTML = content
		cmtd.UserID = uid
		cmtd.UserName = user.Name
		cmtd.UserIconName = user.IconName

		cmt := apicom.NewCmt(cmtd)
		cmt.ContentHTML = content

		respData := SetCmtResponse{Cmt: &cmt}
		return resp.MustComplete(respData)
	} else {
		// Editing a cmt.
		err := da.Cmt.EditCmt(app.DB, id, uid, content, sanitizedToken)
		app.PanicIfErr(err)

		cmt := &apicom.Cmt{EID: validator.EncodeID(id)}
		cmt.ContentHTML = content
		now := time.Now()
		cmt.ModifiedAt = &now

		respData := &SetCmtResponse{Cmt: cmt}
		return resp.MustComplete(respData)
	}
}
