package composeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func deletePost(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	id := validator.MustGetIDFromDict(params, "id")
	entityType := validator.MustGetIntFromDict(params, "entityType")
	db := app.DB
	var err error
	var result interface{}

	switch entityType {
	case defs.Constants.EntityPost:
		{
			err := da.Post.DeleteItem(app.DB, id, uid)
			app.PanicIfErr(err)
			result = app.URL.UserProfile(uid)
			break
		}
	case defs.Constants.EntityDiscussion:
		{
			err = da.Discussion.DeleteItem(db, id, uid)
			app.PanicIfErr(err)
			break
		}
	default:
		panic(fmt.Sprintf("Unsupported entity type %v", entityType))
	}

	return resp.MustComplete(result)
}
