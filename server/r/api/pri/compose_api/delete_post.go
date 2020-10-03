package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func deletePost(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	pid := validator.MustGetIDFromDict(params, "ids")
	_, err := da.Post.DeletePosts(app.DB, []uint64{pid}, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(app.URL.UserProfile(uid))
}
