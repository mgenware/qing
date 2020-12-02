package authp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	authapi "qing/r/api/pub/auth_api"

	"github.com/go-chi/chi"
)

func verifyRegEmail(w http.ResponseWriter, r *http.Request) handler.HTML {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic("Empty input")
	}

	lang := app.ContextLanguage(r)
	dataString, err := app.Service.RegEmailVerificator.Verify(key)
	if err != nil {
		panic(err.Error())
	}
	if dataString == "" {
		// Expired
		panic(app.MasterPageManager.Dictionary(lang).RegEmailVeriExpired)
	}
	createUserData, err := authapi.StringToCreateUserData(dataString)
	app.PanicIfErr(err)

	pwdHash, err := app.Service.HashingAlg.CreateHash(createUserData.Pwd)
	app.PanicIfErr(err)

	uid, err := da.UserPwd.AddPwdBasedUser(app.DB, createUserData.Email, createUserData.Name, pwdHash)
	app.PanicIfErr(err)

	userURL := app.URL.UserProfile(uid)
	http.Redirect(w, r, userURL, 302)
	return handler.HTML(0)
}
