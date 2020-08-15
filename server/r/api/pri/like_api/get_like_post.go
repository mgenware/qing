package likeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/lib/validator"
)

func getLikePOST(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	category := validator.MustGetIntFromDict(params, "type")
	id := validator.MustGetIDFromDict(params, "id")

	if category >= len(dbSources) {
		panic(fmt.Sprintf("Unsupported type %v", category))
	}

	dbSrc := dbSources[category]
	hasLiked, err := dbSrc.HasLiked(app.DB, id, uid)
	app.PanicIfErr(err)

	return resp.MustComplete(hasLiked)
}
