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
	uid := resp.UserID()

	// The meaning of ID depends on the `target_type` param,
	// if `entityType` is present, `id` is like `target_id`,
	// otherwise, `id` is cmt ID.
	id := validator.GetIDFromDict(params, "id")
	entityType := jsonx.GetIntOrDefault(params, "entityType")
	content := validator.MustGetStringFromDict(params, "content")
	content, sanitizedToken := app.Service.Sanitizer.Sanitize(content)

	cmtCore := getCmtDataLayer(entityType)
	if entityType != 0 {
		// We are creating a new cmt.
		capt := validator.MustGetStringFromDict(params, "captcha")
		captResult, err := app.Service.Captcha.Verify(uid, entityType, capt)
		app.PanicIfErr(err)
		if captResult != 0 {
			resp.MustFailWithCode(captResult)
			return
		}
		cmtID, err := cmtCore.InsertCmt(app.DB, content, uid, id, sanitizedToken, captResult)
		app.PanicIfErr(err)

		cmt := &apidata.Cmt{ID: validator.EncodeID(cmtID)}
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
