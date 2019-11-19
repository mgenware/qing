package composeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validator"
	"github.com/mgenware/go-packagex/v5/jsonx"
)

func getCmtDataLayer(eType int) da.CmtCore {
	switch eType {
	case defs.EntityPost:
		return da.Post
	default:
		panic(fmt.Sprintf("Unknown cmt data provider: %v", eType))
	}
}

func setCmt(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	eID := validator.GetIDFromDict(params, "eid")
	hasID := eID != 0
	eType := jsonx.GetIntOrDefault(params, "etype") 
	content := validator.MustGetStringFromDict(params, "content")
	title := validator.MustGetStringFromDict(params, "title")

	content, sanitizedToken := app.Service.Sanitizer.Sanitize(content)

	if !hasID {
		capt := validator.MustGetStringFromDict(params, "captcha")
		cmtCore := getCmtDataLayer(eType)
		captResult, err := app.Service.Captcha.Verify(uid, eType, capt)
		app.PanicIfErr(err)
		if captResult != 0 {
			resp.MustFailWithCode(captResult)
			return
		}
		insertedID, err := da.Post.InsertPost(app.DB, title, content, uid, sanitizedToken, captResult)
		app.PanicIfErr(err)
	} else {
		// Edit post
		err := da.Post.EditPost(app.DB, id, uid, title, content)
		app.PanicIfErr(err)
	}

	newPostURL := app.URL.Post(id)
	resp.MustComplete(newPostURL)
}
