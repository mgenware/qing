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
	postCategory = 0
)

var dbSources = [...]da.LikeInterface{da.PostLike}

func setLike(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	category := validator.MustGetIntFromDict(params, "type")
	id := validator.MustGetIDFromDict(params, "id")
	value := validator.MustGetIntFromDict(params, "value")

	if category >= len(dbSources) {
		panic(fmt.Sprintf("Unsupported type %v", category))
	}

	dbSrc := dbSources[category]
	if value == 1 {
		app.PanicIfErr(dbSrc.Like(app.DB, id, uid))
	} else {
		app.PanicIfErr(dbSrc.CancelLike(app.DB, id, uid))
	}
	return resp.MustComplete(nil)
}
