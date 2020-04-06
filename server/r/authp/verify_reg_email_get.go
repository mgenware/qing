package authp

import (
	"net/http"
	"qing/app"

	"github.com/go-chi/chi"
)

var vError = app.TemplateManager.MustParseLocalizedView("/auth/emailVeriFailed.html")

func veirfyRegEmailGET(w http.ResponseWriter, r *http.Request) {
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

	resp.MustComplete(nil)
}
