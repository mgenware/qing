package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validator"
)

func setPost(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	id := validator.GetIDFromDict(params, "id")
	hasID := id != 0
	title := validator.MustGetStringFromDict(params, "title")
	contentHTML, sanitizedToken := app.Service.Sanitizer.Sanitize(validator.MustGetStringFromDict(params, "contentHTML"))

	if !hasID {
		capt := validator.MustGetStringFromDict(params, "captcha")
		// New post
		captResult, err := app.Service.Captcha.Verify(uid, defs.EntityPost, capt, app.Config.DevMode())
		app.PanicIfErr(err)
		if captResult != 0 {
			resp.MustFailWithCode(captResult)
			return
		}
		insertedID, err := da.Post.InsertPost(app.DB, title, contentHTML, uid, sanitizedToken, captResult)
		app.PanicIfErr(err)
		id = insertedID
	} else {
		// Edit post
		err := da.Post.EditPost(app.DB, id, uid, title, contentHTML, sanitizedToken)
		app.PanicIfErr(err)
	}

	newPostURL := app.URL.Post(id)
	resp.MustComplete(newPostURL)
}
