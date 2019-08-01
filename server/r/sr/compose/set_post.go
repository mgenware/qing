package compose

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/da"
	"qing/lib/validator"
)

func setPostPOST(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	content := validator.MustGetStringFromDict(params, "content")
	title := validator.MustGetStringFromDict(params, "title")

	// Sanitize the content
	content = app.Service.Sanitizer.Sanitize(content)
	_, err := da.Post.InsertPost(app.DB, title, content, uid)
	if err != nil {
		panic(err)
	}
	resp.MustComplete(nil)
}
