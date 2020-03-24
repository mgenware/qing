package authapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/da"
	"qing/lib/validator"
)

func createPwdUserPOST(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())

	name := validator.MustGetStringFromDict(params, "name")
	email := validator.MustGetStringFromDict(params, "email")
	pwd := validator.MustGetStringFromDict(params, "pwd")

	hash, err := app.Service.HashingAlg.CreateHash(pwd)
	if err != nil {
		panic(fmt.Sprintf("Hashing failed: %v", err.Error()))
	}

	db := app.DB
	da.UserPwd.AddPwdBasedUser(db, email, name)
	resp.MustComplete(respData)
}
