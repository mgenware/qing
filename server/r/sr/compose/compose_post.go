package compose

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/da"
)

func compostPOST(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	content, _ := params["content"].(string)
	if content == "" {
		panic("The `content` argument is required")
	}

	postType, _ := params["type"].(string)
	if postType == "" {
		panic("The `type` argument is required")
	}

	if postType == "user_post" {
		err := da.UserPost
	} else {
		panic(fmt.Sprintf("Unknown type \"%v\"", postType))
	}
}
