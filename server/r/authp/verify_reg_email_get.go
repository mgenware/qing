package authp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"

	"github.com/go-chi/chi"
)

func veirfyRegEmailGET(w http.ResponseWriter, r *http.Request) handler.JSON {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic("Empty input")
	}

	dataString, err := app.Service.RegEmailVerificator.Verify(key)
	if err != nil {
		panic(err.Error())
	}
	if dataString == "" {
		// Expired
		panic(app.TemplateManager.LocalizedString(resp.Lang(), "regEmailVeriExpired"))
	}
	createUserData, err := authapi.StringToCreateUserData(dataString)
	app.PanicIfErr(err)

	// TODO: Create new user.
	da.UserPwd.AddPwdBasedUser(app.DB)

	resp := app.HTMLResponse(w, r)
	return resp.MustComplete(nil)
}
