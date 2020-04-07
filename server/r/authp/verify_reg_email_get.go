package authp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"

	"github.com/go-chi/chi"
)

var vError = app.TemplateManager.MustParseLocalizedView("/auth/emailVeriFailed.html")

func veirfyRegEmailGET(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.HTMLResponse(w, r)
	key := chi.URLParam(r, "key")
	if key == "" {
		panic("Empty input")
	}

	data, err := app.Service.RegEmailVerificator.Verify(key)
	if err != nil {
		panic(err.Error())
	}
	if data == "" {
		// Expired
		panic(app.TemplateManager.LocalizedString(resp.Lang(), "regEmailVeriExpired"))
	}
	// TODO: Create new user.

	return resp.MustComplete(nil)
}
