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

	"github.com/mgenware/go-packagex/v5/jsonx"
)

type SetCmtResponse struct {
	Cmt *apidata.Cmt `json:"cmt"`
}

func getCmtDataLayer(targetType int) da.CmtCore {
	switch targetType {
	case defs.EntityPost:
		return da.Post
	default:
		panic(fmt.Sprintf("Unknown cmt data provider: %v", targetType))
	}
}

func setCmt(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	user := resp.User()
	uid := user.ID

	id := validator.GetIDFromDict(params, "id")
	entityType := jsonx.GetIntOrDefault(params, "entityType")
	content := validator.MustGetStringFromDict(params, "content")
	content, sanitizedToken := app.Service.Sanitizer.Sanitize(content)

	cmtCore := getCmtDataLayer(entityType)
	if id == 0 {
		// We are creating a new cmt.
		postID := validator.MustGetIDFromDict(params, "postID")
		capt := validator.MustGetStringFromDict(params, "captcha")
		captResult, err := app.Service.Captcha.Verify(uid, entityType, capt, app.Config.DevMode())
		app.PanicIfErr(err)
		if captResult != 0 {
			resp.MustFailWithCode(captResult)
			return
		}
		cmtID, err := cmtCore.InsertCmt(app.DB, content, uid, postID, sanitizedToken, captResult)
		app.PanicIfErr(err)

		// Construct a DB cmt object without interacting with DB.
		now := time.Now()
		cmtd := &da.CmtData{CmtID: cmtID}
		cmtd.CreatedAt = now
		cmtd.ModifiedAt = now
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

		respData := &SetCmtResponse{Cmt: cmt}
		resp.MustComplete(respData)
	}
}
