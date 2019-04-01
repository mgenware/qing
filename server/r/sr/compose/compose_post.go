package compose

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/da"
	"qing/lib/validate2"
)

func compostPOST(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	content := validate2.MustGetString(params, "content")
	postType := validate2.MustGetString(params, "type")

	if postType == "user_post" {
		title := validate2.MustGetString(params, "title")
		err := da.UserPost.InsertUserPost(app.DB, title, content)
		if err != nil {
			panic(err)
		}
	} else {
		panic(fmt.Sprintf("Unknown type \"%v\"", postType))
	}
}
