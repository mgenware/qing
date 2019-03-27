package profilec

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/da"
)

func setBio(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	bio, _ := params["bio"].(string)
	if bio == "" {
		panic("The argument `bio` cannot be empty")
	}

	// Update DB
	err := da.User.UpdateBio(app.DB, uid, &bio)
	if err != nil {
		resp.MustFail(err)
		return
	}
	resp.MustComplete(nil)
}
