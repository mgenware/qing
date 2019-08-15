package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validator"
)

func setPostPOST(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	content := validator.MustGetStringFromDict(params, "content")
	title := validator.MustGetStringFromDict(params, "title")
	capt := validator.MustGetStringFromDict(params, "captcha")

	content, sanitizedToken := app.Service.Sanitizer.Sanitize(content)
	captResult, err := app.Service.Captcha.Verify(uid, defs.EntityPost, capt)
	app.PanicIfErr(err)
	if captResult != 0 {
		resp.MustFailWithCode(captResult)
		return
	}
	_, err = da.Post.InsertPost(app.DB, title, content, uid, sanitizedToken, captResult)
	app.PanicIfErr(err)
	resp.MustComplete(nil)
}
