package likeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

const (
	postSource = 0
)

var dbSources = [...]da.LikeInterface{da.PostLike}

func setLike(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	src := validator.MustGetIntFromDict(params, "src")
	id := validator.MustGetIDFromDict(params, "id")
	bio := validator.MustGetStringFromDict(params, "bio")
	value := validator.MustGetIntFromDict(params, "value")

	if src >= len(dbSources) {
		panic(fmt.Sprintf("Unsupported src %v", src))
	}

	dbSrc := dbSources[src]
	if value == 1 {
		app.PanicIfErr(dbSrc.Like(app.DB, id, uid))
	} else {
		app.PanicIfErr(dbSrc.CancelLike(app.DB, id, uid))
	}
	return resp.MustComplete(nil)
}
