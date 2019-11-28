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
	content := validator.MustGetStringFromDict(params, "content")
	title := validator.MustGetStringFromDict(params, "title")

	content, sanitizedToken := app.Service.Sanitizer.Sanitize(content)

	if !hasID {
		capt := validator.MustGetStringFromDict(params, "captcha")
		// New post
		captResult, err := app.Service.Captcha.Verify(uid, defs.EntityPost, capt)
		app.PanicIfErr(err)
		if captResult != 0 {
			resp.MustFailWithCode(captResult)
			return
		}
		insertedID, err := da.Post.InsertPost(app.DB, title, content, uid, sanitizedToken, captResult)
		app.PanicIfErr(err)
		id = insertedID
	} else {
		// Edit post
		err := da.Post.EditPost(app.DB, id, uid, title, content, sanitizedToken)
		app.PanicIfErr(err)
	}

	newPostURL := app.URL.Post(id)
	resp.MustComplete(newPostURL)
}
